---
layout: page.11ty.cjs
title: <humane-chat> ⌲ Home
---

# &lt;humane-chat>

`<humane-chat>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<humane-chat>` is just an HTML element. You can it anywhere you can use HTML!

```html
<humane-chat></humane-chat>
```

  </div>
  <div>

<humane-chat></humane-chat>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<humane-chat>` can be configured with attributed in plain HTML.

```html
<humane-chat name="HTML"></humane-chat>
```

  </div>
  <div>

<humane-chat name="HTML"></humane-chat>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<humane-chat>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;humane-chat&gt;</h2>
    <humane-chat .name=${name}></humane-chat>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;humane-chat&gt;</h2>
<humane-chat name="lit-html"></humane-chat>

  </div>
</section>
