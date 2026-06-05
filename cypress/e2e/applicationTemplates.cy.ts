// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Application Templates', () => {
  it('should retrieve', () => {
    cy.testRetrieve('application-templates');
  });
  it('should list', () => {
    cy.testList('application-templates');
  });
});
