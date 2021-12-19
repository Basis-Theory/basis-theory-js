// eslint-disable-next-line max-classes-per-file
import { Chance } from 'chance';
import { hasElement } from '../../src/elements/services/utils';

describe('service utils', () => {
  const chance = new Chance();

  describe('hasElement', () => {
    describe('payload is an object', () => {
      describe('payload is null', () => {
        test('should return false', () => {
          // eslint-disable-next-line unicorn/no-null
          expect(hasElement(null)).toBe(false);
        });
      });

      describe('payload is not null', () => {
        describe('payload has a card or text element', () => {
          class CardElement {}

          class TextElement {}

          test.each([
            [{ [chance.string()]: new CardElement() }],
            [{ [chance.string()]: new TextElement() }],
          ])(
            'should return true, when the payload is %s',
            (expectedPayload) => {
              expect(hasElement(expectedPayload)).toBe(true);
            }
          );
        });

        describe('payload does not have a card or text element', () => {
          test.each([
            [{ [chance.string()]: chance.string() }],
            [{ [chance.string()]: chance.word() }],
            [{ [chance.string()]: chance.integer() }],
            [{ [chance.string()]: () => ({}) }],
          ])(
            'should return false, when the payload is %s',
            (expectedPayload) => {
              expect(hasElement(expectedPayload)).toBe(false);
            }
          );
        });
      });
    });

    describe('payload is not an object', () => {
      test.each([
        [chance.bool()],
        [chance.word()],
        [chance.integer()],
        [() => ({})],
        [undefined],
      ])('should return false, when the payload is %s', (expectedPayload) => {
        expect(hasElement(expectedPayload)).toBe(false);
      });
    });
  });
});
