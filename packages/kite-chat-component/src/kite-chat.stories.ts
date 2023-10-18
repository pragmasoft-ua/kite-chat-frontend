import {Story} from '@storybook/web-components';
import {html} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import {styleMap} from 'lit/directives/style-map.js';
import type {KiteChatElement, KiteMsg} from '.';
import './kite-chat';
import './kite-msg';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Kite/Chat',
  component: 'kite-chat',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
  argTypes: {
    heading: {control: 'text'},
    primaryColor: {control: 'color'},
    onMessage: {action: 'onMessage'},
    open: {control: 'boolean'},
  },
};

type KiteChatProps = {
  open?: boolean;
  heading?: string;
  primaryColor?: string;
  onMessage?(this: KiteChatElement, event: CustomEvent<KiteMsg>): void;
};

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story<KiteChatProps> = ({
  open,
  heading,
  primaryColor,
  onMessage,
}) =>
  html`<kite-chat
    ?open=${open}
    heading=${ifDefined(heading)}
    style=${styleMap({
      '--kite-primary-color': primaryColor,
      'font-family': 'sans-serif',
    })}
    @kite-chat.send=${onMessage}
  >
    <kite-msg>Hi</kite-msg>
    <kite-msg status="read">Hello</kite-msg>
    <kite-msg> Have you heard about Coding and Stuff?</kite-msg>
    <kite-msg status="delivered">
      Yeah I know, they post awesome coding tutorials
    </kite-msg>
    <kite-msg>But did you know they have a youtube channel?</kite-msg>
    <kite-msg status="sent"> Yeah I also subscribed to their channel </kite-msg>
  </kite-chat>`;

export const Chat = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
Chat.args = {
  open: true,
  heading: '🪁 k1te chat',
  primaryColor: '#336',
};
