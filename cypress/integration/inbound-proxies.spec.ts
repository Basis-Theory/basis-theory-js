// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Inbound Proxies', () => {
  it('should create', () => {
    cy.testCreate('inbound-proxies');
  });
  it('should retrieve', () => {
    cy.testRetrieve('inbound-proxies');
  });
  it('should update', () => {
    cy.testUpdate('inbound-proxies');
  });
  it('should delete', () => {
    cy.testDelete('inbound-proxies');
  });
  it('should list', () => {
    cy.testList('inbound-proxies');
  });
});
