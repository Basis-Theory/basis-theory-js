/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Emulates network being offline
     * @param scheme
     */
    goOffline();

    /**
     * Emulates network being online
     * @param scheme
     */
    goOnline();

    testCreate(serviceName: string);
    testRetrieve(serviceName: string);
    testUpdate(serviceName: string);
    testDelete(serviceName: string);
    testRetrieveNoId(serviceName: string);
    testUpdateNoId(serviceName: string);
    testDeleteNoId(serviceName: string);
    testList(serviceName: string);
  }
}
