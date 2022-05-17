import { findScript, injectScript } from '@/elements/script';
import { describeif } from './setup/utils';

describe('Script', () => {
  describeif(typeof window === 'object')('scripts', () => {
    afterEach(() => {
      document.querySelectorAll('html')[0].innerHTML = '';
    });

    test('should find existing script', () => {
      const existingScript = document.createElement('script');

      existingScript.src = 'source?param=1';
      document.head.append(existingScript);

      expect(findScript('source')).toBe(existingScript);
    });

    test('should inject script in document.head', () => {
      const script = injectScript('source');

      expect(document.head.children[0]).toBe(script);
    });

    test('should inject script in document.body', () => {
      document.head.remove();

      const script = injectScript('source');

      expect(document.body.children[0]).toBe(script);
    });

    test("should throw error when can't inject script", () => {
      document.head.remove();
      document.body.remove();

      expect(() => injectScript('source')).toThrow(
        'No <head> or <body> elements found in document.'
      );
    });
  });
});
