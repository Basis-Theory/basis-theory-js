// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('Permissions', () => {
  it('should list', () => {
    cy.testList('permissions');
  });
});
