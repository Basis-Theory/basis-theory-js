Cypress.Commands.add('goOffline', () => {
  cy.log('**go offline**')
    .then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.enable',
      })
    )
    .then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: true,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
        },
      })
    );
});

Cypress.Commands.add('goOnline', () => {
  cy.log('**go online**')
    .then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.emulateNetworkConditions',
        params: {
          offline: false,
          latency: -1,
          downloadThroughput: -1,
          uploadThroughput: -1,
        },
      })
    )
    .then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Network.disable',
      })
    );
});

Cypress.Commands.add('testCreate', (serviceName: string) => {
  cy.intercept('POST', `/${serviceName}`, {}).as('create');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#create').click();

  cy.get('#submit').click();

  cy.wait('@create');
});

Cypress.Commands.add('testRetrieve', (serviceName: string) => {
  cy.intercept('GET', new RegExp(`/${serviceName}/.+`, 'u'), {}).as('retrieve');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#retrieve').click();

  cy.get('#submit').click();

  cy.wait('@retrieve');
});

Cypress.Commands.add('testUpdate', (serviceName: string) => {
  cy.intercept('PUT', new RegExp(`/${serviceName}/.+`, 'u'), {}).as('update');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#update').click();

  cy.get('#submit').click();

  cy.wait('@update');
});

Cypress.Commands.add('testDelete', (serviceName: string) => {
  cy.intercept('DELETE', new RegExp(`/${serviceName}/.+`, 'u'), {}).as(
    'delete'
  );

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#delete').click();

  cy.get('#submit').click();

  cy.wait('@delete');
});

Cypress.Commands.add('testRetrieveNoId', (serviceName: string) => {
  cy.intercept('GET', `/${serviceName}`, {}).as('retrieve');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#retrieve-no-id').click();

  cy.get('#submit').click();

  cy.wait('@retrieve');
});

Cypress.Commands.add('testUpdateNoId', (serviceName: string) => {
  cy.intercept('PUT', `/${serviceName}`, {}).as('update');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#update-no-id').click();

  cy.get('#submit').click();

  cy.wait('@update');
});

Cypress.Commands.add('testDeleteNoId', (serviceName: string) => {
  cy.intercept('DELETE', `/${serviceName}`, {}).as('delete');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#delete-no-id').click();

  cy.get('#submit').click();

  cy.wait('@delete');
});

Cypress.Commands.add('testList', (serviceName: string) => {
  cy.intercept('GET', `/${serviceName}/`, {}).as('list');

  cy.visit('./e2e/cypress/fixtures/crud_client.html');

  cy.get('#service').type(serviceName);
  cy.get('#list').click();

  cy.get('#submit').click();

  cy.wait('@list');
});
