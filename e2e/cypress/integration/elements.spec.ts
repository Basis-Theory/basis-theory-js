context('Elements example', () => {
  it('should load BasisTheoryElements dinamically', () => {
    cy.intercept('js.basistheory.com/elements/index.js', {
      body: `
        window.BasisTheoryElements = {
          init: (apiKey, environment) => {
            alert("BasisTheoryElements " + apiKey + " " + environment);
          },
        };
        if (window.BasisTheory) {
          window.BasisTheory.elements = window.BasisTheoryElements;
        }`,
    });
    cy.visit('examples/elements.html');
    cy.on('window:alert', (val) => {
      expect(val).to.equal(
        `BasisTheoryElements 04ab9d12-4959-4c48-ba03-9ef722efcc5a local`
      );
    });
  });
});
