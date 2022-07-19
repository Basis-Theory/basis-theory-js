context('Elements example', () => {
  it('should load BasisTheoryElements dynamically', () => {
    cy.intercept(/https:\/\/.+?\/elements/u, {
      body: `
        window.BasisTheoryElements = {
          init: (apiKey, baseUrl) => {
            alert("BasisTheoryElements " + apiKey + " " + baseUrl);
          },
        };
        if (window.BasisTheory) {
          window.BasisTheory.elements = window.BasisTheoryElements;
        }`,
    });
    cy.visit('cypress/fixtures/elements.html');
    cy.on('window:alert', (val) => {
      expect(val).to.equal(
        `BasisTheoryElements 04ab9d12-4959-4c48-ba03-9ef722efcc5a https://elements.basistheory.com`
      );
    });
  });
  it('should handle blocked BasisTheoryElements script request', () => {
    cy.intercept(`http://cypress.test/events/initError`, (req) => {
      req.reply({});
    }).as(`initErrorEvent`);
    cy.intercept(/https:\/\/.+?\/elements/u, {
      statusCode: 400,
    });
    cy.visit('cypress/fixtures/elements.html');
    cy.wait('@initErrorEvent')
      .its('request.body')
      .should(
        'equal',
        'There was an unknown error when loading Basis Theory Elements. Check the console for details.'
      );
  });
});
