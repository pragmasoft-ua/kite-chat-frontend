/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import {KiteChatElement} from '@pragmasoft-ukraine/kite-chat-component';

describe('kite-chat', () => {
  test('is defined', () => {
    const el = document.createElement('kite-chat');
    assert.instanceOf(el, KiteChatElement);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<kite-chat></kite-chat>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<kite-chat name="Test"></kite-chat>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el: KiteChatElement = await fixture(html`<kite-chat></kite-chat>`);
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });

  test('styling applied', async () => {
    const el: KiteChatElement = await fixture(html`<kite-chat></kite-chat>`);
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
