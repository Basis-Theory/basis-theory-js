// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Proxies', () => {
  it('should create', () => {
    cy.testCreate('proxies');
  });
  it('should retrieve', () => {
    cy.testRetrieve('proxies');
  });
  it('should update', () => {
    cy.testUpdate('proxies');
  });
  it('should delete', () => {
    cy.testDelete('proxies');
  });
  it('should list', () => {
    cy.testList('proxies');
  });
});
