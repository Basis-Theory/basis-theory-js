context('Tenants', () => {
  it('should retrieve', () => {
    cy.testRetrieveNoId('tenants');
  });
  it('should update', () => {
    cy.testUpdateNoId('tenants');
  });
  it('should delete', () => {
    cy.testDeleteNoId('tenants');
  });
});
