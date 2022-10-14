/// <reference path="./parcel.d.ts"/>
import {css, unsafeCSS} from 'lit';
import tailwindSharedStyles from './shared-styles.css?raw';

export const sharedStyles = css`
  ${unsafeCSS(tailwindSharedStyles)}
`;
