import type {
  BasisTheoryElements,
  CreateAtomicBank,
} from '@Basis-Theory/basis-theory-elements-interfaces/elements';
import type { RequestOptions } from '@basis-theory/basis-theory-elements-interfaces/sdk';
import { Chance } from 'chance';
import { delegateAtomicBanks } from '../../src/elements';
import { ELEMENTS_INIT_ERROR_MESSAGE } from '../../src/elements/constants';
import { hasElement } from '../../src/elements/services/utils';

jest.mock('../../src/elements/services/utils');

describe('elements bank service', () => {
  const chance = new Chance();
  const expectedCreatedToken = chance.string();

  let elementsInstance: BasisTheoryElements;

  describe('elements is initialized', () => {
    beforeEach(() => {
      elementsInstance = ({
        atomicBanks: {
          create: jest.fn().mockReturnValue(expectedCreatedToken),
        },
      } as unknown) as BasisTheoryElements;
    });

    describe('element instance is on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(true);
      });

      test('should delegate create call to elements', () => {
        const serviceInstance = new (delegateAtomicBanks(elementsInstance))({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();
        const createdToken = serviceInstance.create(
          (expectedPayload as unknown) as CreateAtomicBank,
          expectedRequestOptions as RequestOptions
        );

        expect(elementsInstance.atomicBanks.create).toHaveBeenCalledTimes(1);
        expect(elementsInstance.atomicBanks.create).toHaveBeenCalledWith(
          expectedPayload,
          expectedRequestOptions
        );
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });

    describe('element instance is not on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(false);
      });

      test('should delegate create call to bt.js', () => {
        const superCreate = jest.fn().mockReturnValue(expectedCreatedToken);
        const ClassToBeInstantiated = delegateAtomicBanks(elementsInstance);

        Object.setPrototypeOf(ClassToBeInstantiated.prototype, {
          create: superCreate,
        });
        const serviceInstance = new ClassToBeInstantiated({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();

        const createdToken = serviceInstance.create(
          (expectedPayload as unknown) as CreateAtomicBank,
          expectedRequestOptions as RequestOptions
        );

        expect(superCreate).toHaveBeenCalledTimes(1);
        expect(superCreate).toHaveBeenCalledWith(
          expectedPayload,
          expectedRequestOptions
        );
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });
  });

  describe('elements is not initialized', () => {
    describe('element instance is on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(true);
      });

      test('should throw an error letting the user know that elements has not been initialized', () => {
        const serviceInstance = new (delegateAtomicBanks(undefined))({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();

        expect(() =>
          serviceInstance.create(
            (expectedPayload as unknown) as CreateAtomicBank,
            expectedRequestOptions as RequestOptions
          )
        ).toThrow(ELEMENTS_INIT_ERROR_MESSAGE);
      });
    });

    describe('element instance is not on the payload', () => {
      beforeEach(() => {
        (hasElement as jest.Mock).mockReturnValue(false);
      });

      test('should delegate create call to bt.js', () => {
        const superCreate = jest.fn().mockReturnValue(expectedCreatedToken);
        const ClassToBeInstantiated = delegateAtomicBanks(undefined);

        Object.setPrototypeOf(ClassToBeInstantiated.prototype, {
          create: superCreate,
        });
        const serviceInstance = new ClassToBeInstantiated({
          apiKey: chance.string(),
          baseURL: chance.url(),
        });
        const expectedPayload = chance.string(),
          expectedRequestOptions = chance.string();
        const createdToken = serviceInstance.create(
          (expectedPayload as unknown) as CreateAtomicBank,
          expectedRequestOptions as RequestOptions
        );

        expect(superCreate).toHaveBeenCalledTimes(1);
        expect(superCreate).toHaveBeenCalledWith(
          expectedPayload,
          expectedRequestOptions
        );
        expect(createdToken).toBe(expectedCreatedToken);
      });
    });
  });
});
