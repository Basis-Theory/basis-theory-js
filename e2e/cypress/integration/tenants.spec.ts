// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Tenants', () => {
  it('should retrieve', () => {
    cy.testRetrieveNoId('tenants/self');
  });
  it('should update', () => {
    cy.testUpdateNoId('tenants/self');
  });
  it('should delete', () => {
    cy.testDeleteNoId('tenants/self');
  });
});
