// eslint-disable-next-line spaced-comment
///  <reference path="../support/index.d.ts" />

context('API error', () => {
  beforeEach(() => {
    cy.visit('./cypress/fixtures/credit_card_api_error.html');
  });

  context('network error/network offline', () => {
    // eslint-disable-next-line jest/no-duplicate-hooks
    beforeEach(() => {
      cy.intercept('POST', '/tokens', {
        forceNetworkError: true,
      });
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
      message = 'some error response';

    // eslint-disable-next-line jest/no-duplicate-hooks
    beforeEach(() => {
      cy.intercept('POST', '/tokens', {
        statusCode: status,
        body: { message },
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
          data: {
            message,
          },
          name: 'BasisTheoryApiError',
        })
      );
    });
  });
});
