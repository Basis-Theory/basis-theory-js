import { v4 as uuid } from 'uuid';

context('Credit Card example', () => {
  beforeEach(() => {
    cy.intercept('https://js.basistheory.com/', (req) => {
      req.redirect(
        `${req.headers.referer}/library/dist/basis-theory-js.bundle.js`
      );
    });

    cy.visit('examples/credit_card.html');

    cy.intercept(
      {
        pathname: '/atomic/cards',
      },
      (req) => {
        const year = (new Date().getFullYear() + 1).toString();

        /* eslint-disable camelcase */
        req.reply({
          statusCode: 201,
          body: {
            id: uuid(),
            card: {
              number: `${'X'.repeat(12)}4242`,
              expiration_month: '10',
              expiration_year: year,
              cvc: 'XXX',
            },
          },
        });
        /* eslint-enable camelcase */
      }
    ).as('createCreditCard');
  });

  it('shoud load BasisTheory', () => {
    cy.window().should('have.property', 'BasisTheory');
  });

  it('should have all credit card form fields', () => {
    cy.get('form').should('have.length', 1);
    cy.get('form').find('#expiration_month').should('exist');
    cy.get('form').find('#expiration_year').should('exist');
    cy.get('form').find('#cvc').should('exist');
  });

  it('should be able to submit form with minimum information and get masked information back', () => {
    const year = (new Date().getFullYear() + 1).toString();

    cy.get('form').find('#card_number').type('4242424242424242');
    cy.get('form').find('#expiration_month').type('10');
    cy.get('form').find('#expiration_year').type(year);
    cy.get('form').find('#cvc').type('123');
    cy.get('form').submit();

    cy.wait('@createCreditCard').then((i) => {
      const alert = cy.stub();

      cy.on('window:alert', alert);

      cy.get('#cards_wrapper').children().should('have.length', 1);
      cy.get('#cards_wrapper')
        .find('.card-info')
        .first()
        .should('have.text', `${'X'.repeat(12)}4242`)
        .next()
        .should('contain.text', `10/${year}`)
        .find('a')
        .click()
        .then(() => {
          expect(alert.getCall(0)).to.be.calledWith(i.response.body.id);
        });
    });
  });
});
