import {css, unsafeCSS} from 'lit';
import tailwindSharedStyles from './shared-styles.css?inline';

export const sharedStyles = css`
  ${unsafeCSS(tailwindSharedStyles)}
`;
