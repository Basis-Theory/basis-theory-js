context('Applications', () => {
  it('should create', () => {
    cy.testCreate('applications');
  });
  it('should retrieve', () => {
    cy.testRetrieve('applications');
  });
  it('should update', () => {
    cy.testUpdate('applications');
  });
  it('should delete', () => {
    cy.testDelete('applications');
  });
  it('should list', () => {
    cy.testList('applications');
  });
});
