// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Atomic Cards', () => {
  it('should create', () => {
    cy.testCreate('atomic/cards');
  });
  it('should retrieve', () => {
    cy.testRetrieve('atomic/cards');
  });
  it('should delete', () => {
    cy.testDelete('atomic/cards');
  });
  it('should list', () => {
    cy.testList('atomic/cards');
  });
});
