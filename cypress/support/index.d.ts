/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      loginAsClient(): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      loginAsClientAna(): Chainable<void>;
      loginAsNikola(): Chainable<void>;
      loginAsJelena(): Chainable<void>;
      loginAsMarko(): Chainable<void>;
      loginAsMirko(): Chainable<void>;
    }
  }
}

export {};
