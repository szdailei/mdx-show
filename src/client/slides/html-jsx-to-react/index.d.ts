import type { ReactElement, PropsWithChildren } from 'react';

export type ReactElementWithhChildren = ReactElement & {
  props: {
    children?: {
      props?: PropsWithChildren;
    };
  };
};

export type CreatedNode = ReactElementWithhChildren | string;

export type MdxToReact = (mdx: string, jsCode: string) => ReactElementWithhChildren[];
