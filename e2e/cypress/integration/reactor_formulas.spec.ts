context('Reactor Formulas', () => {
  it('should create', () => {
    cy.testCreate('reactorFormulas');
  });
  it('should retrieve', () => {
    cy.testRetrieve('reactorFormulas');
  });
  it('should update', () => {
    cy.testUpdate('reactorFormulas');
  });
  it('should delete', () => {
    cy.testDelete('reactorFormulas');
  });
  it('should list', () => {
    cy.testList('reactorFormulas');
  });
});
