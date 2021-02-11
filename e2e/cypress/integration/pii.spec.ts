context('Credit Card example', () => {
  beforeEach(() => {
    cy.visit('examples/pii.html');
    cy.intercept({
      method: 'POST',
      pathname: '/vault/tokens',
    }).as('createToken');
    cy.intercept({
      method: 'GET',
      pathname: '/vault/tokens/*',
    }).as('getToken');
  });

  it('shoud load BasisTheory', () => {
    cy.window().should('have.property', 'BasisTheory');
  });

  it('should have all required credit card form fields', () => {
    cy.get('form').should('have.length', 1);
    cy.get('form').find('#first_name').should('exist');
    cy.get('form').find('#last_name').should('exist');
    cy.get('form').find('#dob').should('exist');
  });

  it('should be able to submit form, encrypt and get token id', () => {
    cy.get('#show_data').should('not.be.visible');

    cy.get('form').find('#first_name').type('John');
    cy.get('form').find('#last_name').type('Doe');
    cy.get('form').find('#dob').type('1990-01-01');
    cy.get('form').submit();

    cy.wait('@createToken').then((createToken) => {
      const alert = cy.stub();
      cy.on('window:alert', alert);

      cy.get('#show_data').should('be.visible');
      cy.window().should('have.property', 'token');

      // can't chain this block 🤦‍♂️
      expect(createToken.request.body.data).to.have.property('ciphertext');
      expect(createToken.request.body.data).to.have.property('ephemPublicKey');
      expect(createToken.request.body.data).to.have.property('iv');
      expect(createToken.request.body.data).to.have.property('mac');

      cy.get('#show_data')
        .click()
        .then(() => {
          cy.wait('@getToken').then((getToken) => {
            // cy.window().its('token').should('equal', getToken.response.body.id);

            expect(getToken.response.body.data).to.have.property(
              'ciphertext',
              createToken.request.body.data.ciphertext
            );
            expect(getToken.response.body.data).to.have.property(
              'ephemPublicKey',
              createToken.request.body.data.ephemPublicKey
            );
            expect(getToken.response.body.data).to.have.property(
              'iv',
              createToken.request.body.data.iv
            );
            expect(getToken.response.body.data).to.have.property(
              'mac',
              createToken.request.body.data.mac
            );

            expect(alert.getCall(0)).to.be.calledWith(
              JSON.stringify({
                firstName: 'John',
                lastName: 'Doe',
                dob: '1990-01-01',
              })
            );
          });
        });
    });
  });
});

export {};
