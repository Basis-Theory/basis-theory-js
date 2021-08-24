import { v4 as uuid } from 'uuid';

context('PII example', () => {
  beforeEach(() => {
    let encryptedData: string;

    cy.visit('examples/pii.html');
    cy.intercept(
      {
        method: 'POST',
        pathname: '/tokens',
      },
      (req) => {
        if (!req.url.includes('localhost')) {
          encryptedData = req.body.data;
          req.reply({
            statusCode: 201,
            body: {
              id: uuid(),
              data: req.body.data,
            },
          });
        }
      }
    ).as('createToken');
    cy.intercept(
      {
        method: 'GET',
        pathname: '/tokens/*',
      },
      (req) => {
        if (!req.url.includes('localhost')) {
          const urlParts = req.url.split('/');
          const id = urlParts.pop();

          req.reply({
            statusCode: 200,
            body: {
              id,
              data: encryptedData,
            },
          });
        }
      }
    ).as('getToken');
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

  it('should be able to submit form, encrypt and get token by id', () => {
    cy.get('#show_data').should('not.be.visible');

    cy.get('form').find('#first_name').type('John');
    cy.get('form').find('#last_name').type('Doe');
    cy.get('form').find('#dob').type('1990-01-01');
    cy.window()
      .its('keyPair')
      .should('exist')
      .then(() => {
        cy.get('form').submit();

        cy.wait('@createToken').then((createToken) => {
          cy.get('#show_data').should('be.visible');
          cy.window().should('have.property', 'token');

          expect(createToken.request.body.data).to.be.a('string');

          cy.get('#show_data')
            .click()
            .then(() => {
              cy.on('window:alert', (message) => {
                expect(message).to.equal(
                  JSON.stringify({
                    firstName: 'John',
                    lastName: 'Doe',
                    dob: '1990-01-01',
                  })
                );
              });
              cy.wait('@getToken').then((getToken) => {
                expect(getToken.response.body.data).to.equal(
                  createToken.request.body.data
                );
              });
            });
        });
      });
  });
});

export {};
