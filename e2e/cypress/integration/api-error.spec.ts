// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('API error', () => {
  beforeEach(() => {
    cy.visit('./e2e/cypress/fixtures/credit_card_api_error.html');
  });

  context('network error/network offline', () => {
    beforeEach(() => {
      cy.goOffline();
    });

    afterEach(() => {
      cy.goOnline();
    });

    it('should return error with status of -1 and data of undefined', () => {
      cy.get('form').find('#card_number').type('4242424242424242');
      cy.get('form').find('#expiration_month').type('10');
      cy.get('form').find('#expiration_year').type('2029');
      cy.get('form').find('#cvc').type('123');
      cy.get('form').submit();
      cy.get('#response').should(
        'have.text',
        JSON.stringify({
          status: -1,
          name: 'BasisTheoryApiError',
        })
      );
    });
  });

  context('error response', () => {
    const status = 400,
      data = 'some error response';

    beforeEach(() => {
      cy.intercept('POST', '/atomic/cards', {
        statusCode: status,
        body: data,
      });
    });

    it('should return error with the API status and data', () => {
      cy.get('form').find('#card_number').type('4242424242424242');
      cy.get('form').find('#expiration_month').type('10');
      cy.get('form').find('#expiration_year').type('2029');
      cy.get('form').find('#cvc').type('123');
      cy.get('form').submit();
      cy.get('#response').should(
        'have.text',
        JSON.stringify({
          status,
          data,
          name: 'BasisTheoryApiError',
        })
      );
    });
  });
});
