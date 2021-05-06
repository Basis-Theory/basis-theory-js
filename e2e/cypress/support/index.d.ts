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
  }
}
