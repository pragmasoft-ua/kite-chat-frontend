import {setCustomElementsManifest} from '@storybook/web-components';

import customElementsManifest from '../custom-elements.json';

setCustomElementsManifest(customElementsManifest);

export const parameters = {
  docs: {
    // Opt-out of inline rendering
    inlineStories: false,
  },
};
