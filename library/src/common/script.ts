const findScript = (url: string): HTMLScriptElement | null =>
  document.querySelector<HTMLScriptElement>(`script[src^="${url}"]`);

const injectScript = (url: string): HTMLScriptElement => {
  const script = document.createElement('script');

  script.src = url;

  const parent = document.head || document.body;

  if (!parent) {
    throw new Error('No <head> or <body> elements found in document.');
  }

  parent.append(script);

  return script;
};

export { findScript, injectScript };
