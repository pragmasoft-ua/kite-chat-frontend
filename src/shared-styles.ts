import {css, unsafeCSS} from 'lit';
import tailwindSharedStyles from 'bundle-text:./shared-styles.css';

export const sharedStyles = css`
  ${unsafeCSS(tailwindSharedStyles)}
`;
