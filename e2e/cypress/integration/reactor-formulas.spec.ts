// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Reactor Formulas', () => {
  it('should create', () => {
    cy.testCreate('reactor-formulas');
  });
  it('should retrieve', () => {
    cy.testRetrieve('reactor-formulas');
  });
  it('should update', () => {
    cy.testUpdate('reactor-formulas');
  });
  it('should delete', () => {
    cy.testDelete('reactor-formulas');
  });
  it('should list', () => {
    cy.testList('reactor-formulas');
  });
});
