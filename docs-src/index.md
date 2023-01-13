---
layout: page.11ty.cjs
title: <kite-chat> ⌲ Home
---

# &lt;kite-chat>

`<kite-chat>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<kite-chat>` is just an HTML element. You can it anywhere you can use HTML!

```html
<kite-chat></kite-chat>
```

  </div>
  <div>

<kite-chat></kite-chat>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<kite-chat>` can be configured with attributed in plain HTML.

```html
<kite-chat name="HTML"></kite-chat>
```

  </div>
  <div>

<kite-chat name="HTML"></kite-chat>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<kite-chat>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;kite-chat&gt;</h2>
    <kite-chat .name=${name}></kite-chat>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;kite-chat&gt;</h2>
<kite-chat name="lit-html"></kite-chat>

  </div>
</section>
