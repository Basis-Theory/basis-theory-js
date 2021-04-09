import { findScript, injectScript } from '../src/common/utils';
import { describeif } from './setup/utils';

describeif(typeof window === 'object')('Utils', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('should find existing script', () => {
    const existingScript = document.createElement('script');
    existingScript.src = 'source?param=1';
    document.head.appendChild(existingScript);

    expect(findScript('source')).toBe(existingScript);
  });

  it('should inject script in document.head', () => {
    const script = injectScript('source');

    expect(document.head.children[0]).toBe(script);
  });

  it('should inject script in document.body', () => {
    document.head.remove();

    const script = injectScript('source');

    expect(document.body.children[0]).toBe(script);
  });

  it("should throw error when can't inject script", () => {
    document.head.remove();
    document.body.remove();

    expect(() => injectScript('source')).toThrowError(
      'No <head> or <body> elements found in document.'
    );
  });
});
