// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    testCreate(serviceName: string);
    testRetrieve(serviceName: string);
    testUpdate(serviceName: string, method: string);
    testDelete(serviceName: string);
    testRetrieveNoId(serviceName: string);
    testUpdateNoId(serviceName: string);
    testDeleteNoId(serviceName: string);
    testList(serviceName: string);
  }
}
