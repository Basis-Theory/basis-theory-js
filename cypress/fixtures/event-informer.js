window.informEventCypress = (event, type = event.type) => {
  if (window.Cypress) {
    return fetch(`http://cypress.test/events/${type}`, {
      body: JSON.stringify(event),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return Promise.resolve();
};
