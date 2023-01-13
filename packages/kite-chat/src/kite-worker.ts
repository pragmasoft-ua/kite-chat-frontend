// https://joshuatz.com/posts/2021/strongly-typed-service-workers/
/// <reference lib="webworker" />

declare const WS_CLOSE_REASON_GONE_AWAY = 1001;

declare const self: SharedWorkerGlobalScope;

import {CHANNEL_NAME, SUBPROTOCOL} from './shared-constants';
import type {PlaintextMessage, KiteMsg, JoinChannel} from './kite-types';
import {MsgType} from './kite-types';
import {decodeKiteMsg, encodeKiteMsg} from './serialization';
import {MessagePort} from 'worker_threads';

console.log('shared worker loaded');

let ws: WebSocket | null;
let pendingCommand: JoinChannel | null = null;
const tabPorts = new Set<MessagePort>();

// Create a broadcast channel to notify about state changes
const broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

// Event handler called when a tab tries to connect to this worker.
self.onconnect = onWorkerConnect;

function onWorkerConnect(e: MessageEvent) {
  console.log('onconnect');
  const port = e.ports[0];
  port.onmessage = onWorkerMessage;
  port.onmessageerror = console.error;
}

function onWorkerMessage(e: MessageEvent<KiteMsg>) {
  const p = e.target as unknown as MessagePort;
  const payload = e.data;
  if (!payload) throw new Error('no payload');
  console.debug('onWorkerMessage', JSON.stringify(payload));
  switch (payload.type) {
    case MsgType.PLAINTEXT:
      onTabMessage(payload, p);
      break;
    case MsgType.JOIN:
      onTabConnected(payload, p);
      break;
    case MsgType.DISCONNECTED:
      onTabDisconnected(p);
      break;
  }
}

const READY_STATES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

function onTabMessage(payload: PlaintextMessage, port: MessagePort) {
  if (!ws || ws.readyState !== ws.OPEN) {
    // OPEN == 1
    console.error(
      `Cannot send, websocket is not connected there's ${
        tabPorts.size
      } tabs, ws state is ${ws ? READY_STATES[ws.readyState] : 'MISSING'}`
    );
    return;
  }
  const arrayBuffer = encodeKiteMsg(payload);
  ws.send(arrayBuffer);
  tabPorts.forEach((tabPort) => {
    if (tabPort !== port) {
      port.postMessage(payload);
    }
  });
}

function onTabConnected(payload: JoinChannel, port: MessagePort) {
  const endpoint = payload.endpoint;
  tabPorts.add(port);
  console.debug('onTabConnected', tabPorts.size);
  if (!ws) {
    ws = new WebSocket(endpoint, SUBPROTOCOL);
    // ws.binaryType = 'arraybuffer';
    ws.onmessage = onWsMessage;
    ws.onopen = onWsOpen;
    ws.onclose = onWsClose;
    ws.onerror = onWsError;
    pendingCommand = payload;
  } else if (ws.url !== endpoint) {
    console.warn(
      `worker already connected to ${ws.url} and cannot be reconnected to ${endpoint}`
    );
  }
  port.postMessage({type: MsgType.CONNECTED});
}

function onTabDisconnected(port: MessagePort) {
  port.close();
  tabPorts.delete(port);
  const tabsCount = tabPorts.size;
  console.debug('onTabDisconnected', tabsCount);
  if (tabsCount === 0) {
    // https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4
    ws?.close(WS_CLOSE_REASON_GONE_AWAY, 'all active tabs closed');
  }
}

function onWsMessage(event: MessageEvent) {
  const kiteMsg = decodeKiteMsg(event.data);
  broadcastChannel.postMessage(kiteMsg);
}

function onWsOpen() {
  console.debug('onWsOpen');
  if (null == pendingCommand) {
    console.error('unexpected state, close ws');
    ws?.close();
    return;
  }
  const encoded = encodeKiteMsg(pendingCommand);
  pendingCommand = null;
  ws?.send(encoded);
  // TODO flush queue
}

function onWsClose() {
  console.debug('onWsClose');
  ws = null;
  pendingCommand = null;
}

function onWsError() {
  console.debug('onWsError');
  ws = null;
  pendingCommand = null;
}
