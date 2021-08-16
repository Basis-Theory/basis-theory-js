context('Reactors', () => {
  it('should create', () => {
    cy.testCreate('reactors');
  });
  it('should retrieve', () => {
    cy.testRetrieve('reactors');
  });
  it('should update', () => {
    cy.testUpdate('reactors');
  });
  it('should delete', () => {
    cy.testDelete('reactors');
  });
  it('should list', () => {
    cy.testList('reactors');
  });
});
