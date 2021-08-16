context('Tokens', () => {
  it('should create', () => {
    cy.testCreate('tokens');
  });
  it('should delete', () => {
    cy.testDelete('tokens');
  });
  it('should list', () => {
    cy.testList('tokens');
  });
});
