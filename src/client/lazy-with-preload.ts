import React, { ComponentType, LazyExoticComponent } from 'react';

type FuncToCallImport = () => Promise<{ default: ComponentType<unknown> }>;
type ModuleTobeImported = LazyExoticComponent<ComponentType<unknown>> & {
  preload: FuncToCallImport;
};

function lazyWithPreload(callback: FuncToCallImport) {
  const Component = React.lazy(callback) as ModuleTobeImported;
  Component.preload = callback;
  return Component;
}

export default lazyWithPreload;
