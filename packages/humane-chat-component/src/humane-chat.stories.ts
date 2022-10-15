import {Story} from '@storybook/web-components';
import {html} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import {styleMap} from 'lit/directives/style-map.js';
import type {HumaneChatElement, PayloadMsg} from './';
import './humane-chat.ts';
import './humane-msg.ts';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Humane/Chat',
  component: 'humane-chat',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
  argTypes: {
    title: {control: 'text'},
    primaryColor: {control: 'color'},
    onMessage: {action: 'onClick'},
    open: {control: 'boolean'},
  },
};

type HumaneChatProps = {
  title?: string;
  primaryColor?: string;
  open?: boolean;
  onMessage?(
    this: HumaneChatElement,
    event: CustomEvent<PayloadMsg<string>>
  ): void;
};

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: Story<HumaneChatProps> = ({
  open,
  title,
  primaryColor,
}) => html`<humane-chat
  ?open=${open}
  title=${ifDefined(title)}
  style=${styleMap({
    '--humane-primary-color': primaryColor,
    'font-family': 'sans-serif',
  })}
>
  <humane-msg>Hi</humane-msg>
  <humane-msg status="read">Hello</humane-msg>
  <humane-msg> Have you heard about Coding and Stuff?</humane-msg>
  <humane-msg status="delivered">
    Yeah I know, they post awesome coding tutorials
  </humane-msg>
  <humane-msg>But did you know they have a youtube channel?</humane-msg>
  <humane-msg status="sent">
    Yeah I also subscribed to their channel
  </humane-msg>
</humane-chat>`;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
Primary.args = {
  open: true,
  title: 'test title',
};
