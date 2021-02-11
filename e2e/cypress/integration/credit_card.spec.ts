context('Credit Card example', () => {
  beforeEach(() => {
    cy.visit('examples/credit_card.html');
    cy.intercept({
      pathname: '/payments/credit_card',
    }).as('createCreditCard');
  });

  it('shoud load BasisTheory', () => {
    cy.window().should('have.property', 'BasisTheory');
  });

  it('should have all required credit card form fields', () => {
    cy.get('form').should('have.length', 1);
    cy.get('form').find('#holder_name').should('exist');
    cy.get('form').find('#card_number').should('exist');
    cy.get('form').find('#expiration').should('exist');
    cy.get('form').find('#cvv').should('exist');
  });

  it('should be able to submit form and get masked information back', () => {
    cy.get('form').find('#holder_name').type('John Doe');
    cy.get('form').find('#card_number').type('1234567891011121');
    cy.get('form').find('#expiration').type('10/22');
    cy.get('form').find('#cvv').type('123');
    cy.get('form').submit();

    cy.wait('@createCreditCard').then((i) => {
      const alert = cy.stub();

      cy.on('window:alert', alert);

      cy.get('#cards_wrapper').children().should('have.length', 1);
      cy.get('#cards_wrapper').find('h3').should('have.text', 'John Doe');
      cy.get('#cards_wrapper')
        .find('.card-info')
        .first()
        .should('have.text', `${'*'.repeat(12)}1121`)
        .next()
        .should('contain.text', '10/22')
        .find('a')
        .click().then(() => {
          expect(alert.getCall(0)).to.be.calledWith(i.response.body.token)
        })
      
    });
  });
});
