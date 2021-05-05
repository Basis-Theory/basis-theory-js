context('API error', () => {
  beforeEach(() => {
    cy.visit('./e2e/cypress/fixtures/credit_card_api_error.html');
  });

  context('network error', () => {
    beforeEach(() => {
      cy.intercept('/api-error').as('network-error');
    });

    it('should return error with status of -1 and data of undefined', () => {
      cy.get('form').find('#card_number').type('4242424242424242');
      cy.get('form').find('#expiration_month').type('10');
      cy.get('form').find('#expiration_year').type('2029');
      cy.get('form').find('#cvc').type('123');
      cy.get('form').submit();

      cy.wait('@network-error').then(({ request: { body } }) => {
        const parsedBody = JSON.parse(body);

        expect(parsedBody.name).to.eq('BasisTheoryApiError');
        expect(parsedBody.status).to.eq(-1);
        expect(parsedBody.data).to.eq(undefined);
      });
    });
  });

  context('error response', () => {
    const status = 400,
      data = 'some error response';

    beforeEach(() => {
      cy.intercept('/atomic/cards', {
        statusCode: status,
        body: data,
      });
      cy.intercept('/api-error').as('api-error');
    });

    it('should return error with the API status and data', () => {
      cy.get('form').find('#card_number').type('4242424242424242');
      cy.get('form').find('#expiration_month').type('10');
      cy.get('form').find('#expiration_year').type('2029');
      cy.get('form').find('#cvc').type('123');
      cy.get('form').submit();

      cy.wait('@api-error').then(({ request: { body } }) => {
        const parsedBody = JSON.parse(body);

        expect(parsedBody.name).to.eq('BasisTheoryApiError');
        expect(parsedBody.data).to.eq(data);
        expect(parsedBody.status).to.eq(status);
      });
    });
  });
});
