export const assertInit = <T>(prop: T): NonNullable<T> => {
  if (prop === null || prop === undefined) {
    throw new Error('BasisTheory has not yet been properly initialized.');
  }
  return prop as NonNullable<T>;
};

export const findScript = (url: string): HTMLScriptElement | null => {
  return document.querySelector<HTMLScriptElement>(`script[src^="${url}"]`);
};

export const injectScript = (url: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.src = url;

  const parent = document.head || document.body;

  if (!parent) {
    throw new Error('No <head> or <body> elements found in document.');
  }

  parent.appendChild(script);

  return script;
};
