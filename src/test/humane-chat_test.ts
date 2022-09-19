/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {HumaneChatElement} from '../humane-chat.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import './..';

suite('humane-chat', () => {
  test('is defined', () => {
    const el = document.createElement('humane-chat');
    assert.instanceOf(el, HumaneChatElement);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<humane-chat></humane-chat>`);
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
    const el = await fixture(html`<humane-chat name="Test"></humane-chat>`);
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
    const el: HumaneChatElement = await fixture(
      html`<humane-chat></humane-chat>`
    );
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
    const el: HumaneChatElement = await fixture(
      html`<humane-chat></humane-chat>`
    );
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
