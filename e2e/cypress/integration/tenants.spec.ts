context('Tenants', () => {
  it('should retrieve', () => {
    cy.testRetrieveNoId('tenants/sef');
  });
  it('should update', () => {
    cy.testUpdateNoId('tenants/sef');
  });
  it('should delete', () => {
    cy.testDeleteNoId('tenants/sef');
  });
});
