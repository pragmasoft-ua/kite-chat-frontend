---
layout: page.11ty.cjs
title: <human-livechat> ⌲ Home
---

# &lt;human-livechat>

`<human-livechat>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<human-livechat>` is just an HTML element. You can it anywhere you can use HTML!

```html
<human-livechat></human-livechat>
```

  </div>
  <div>

<human-livechat></human-livechat>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<human-livechat>` can be configured with attributed in plain HTML.

```html
<human-livechat name="HTML"></human-livechat>
```

  </div>
  <div>

<human-livechat name="HTML"></human-livechat>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<human-livechat>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;human-livechat&gt;</h2>
    <human-livechat .name=${name}></human-livechat>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;human-livechat&gt;</h2>
<human-livechat name="lit-html"></human-livechat>

  </div>
</section>
