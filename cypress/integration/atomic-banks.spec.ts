// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Atomic Banks', () => {
  it('should create', () => {
    cy.testCreate('atomic/banks');
  });
  it('should retrieve', () => {
    cy.testRetrieve('atomic/banks');
  });
  it('should delete', () => {
    cy.testDelete('atomic/banks');
  });
  it('should list', () => {
    cy.testList('atomic/banks');
  });
});
