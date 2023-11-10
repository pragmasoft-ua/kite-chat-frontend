/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit';
import { KiteChatElement, KiteMsgElement } from '../src/index';

describe('kite-chat', () => {
  it('is defined', async () => {
    const el: KiteChatElement = await fixture(html`<kite-chat></kite-chat>`);
    assert.exists(el);
  });

  it('is dialog open', async () => {
    const el: KiteChatElement = await fixture(html`<kite-chat open></kite-chat>`);
    const isOpen = el.getAttribute('open') !== null;
    assert.isTrue(isOpen);
  });

  it('is dialog closed', async () => {
    const el: KiteChatElement = await fixture(html`<kite-chat></kite-chat>`);
    const isOpen = el.getAttribute('open') !== null;
    assert.isFalse(isOpen);
  });

  it('contains messages', async () => {
    const el: KiteChatElement = await fixture(html`
      <kite-chat open>
        <kite-msg>Test Message 1</kite-msg>
        <kite-msg>Test Message 2</kite-msg>
      </kite-chat>
    `);

    const messages: NodeListOf<KiteMsgElement> = el.querySelectorAll('kite-msg');
    assert.equal(messages.length, 2);
    assert.equal(messages[0].innerText, 'Test Message 1');
    assert.equal(messages[1].innerText, 'Test Message 2');
  });
});
