const { default: axios } = require("axios");

const getIframeDocument = () => {
  return cy
    .get(".razorpay-checkout-frame")
    .its("0.contentDocument")
    .should("exist");
};

const getIframeBody = () => {
  return getIframeDocument()
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};

describe("PlayStation 5", () => {
  it("cart", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.visit("https://shopatsc.com/account/login")
      .then(() => {
        cy.get("#customer_email")
          .type(Cypress.env("username"))
          .then(() => {
            cy.get("#customer_password")
              .type(Cypress.env("password"))
              .then(() => {
                cy.get(".form-group > .btn").click();
              });
          });
      })
      .then(() => {
        axios.post("https://shopatsc.com/cart/add.js", {
          items: [
            {
              id: Cypress.env("variant"),
              quantity: 1,
            },
          ],
        });
      })
      .then(() => {
        cy.wait(500);
        cy.visit("https://shopatsc.com/cart").then(() => {
          cy.get("#pincode_input").clear();
          cy.get("#pincode_input").type(Cypress.env("pincode"));
          cy.get("#check-delivery-submit").click();
          cy.get("#checkout_button").click();
        });
      })
      .then(() => {
        cy.wait(250);

        cy.get("#checkout_shipping_address_first_name").clear();
        cy.get("#checkout_shipping_address_first_name").type(
          Cypress.env("first_name")
        );

        cy.get("#checkout_shipping_address_last_name").clear();
        cy.get("#checkout_shipping_address_last_name").type(
          Cypress.env("last_name")
        );

        cy.get("#checkout_shipping_address_address1").clear();
        cy.get("#checkout_shipping_address_address1").type(
          Cypress.env("address_first")
        );

        cy.get("#checkout_shipping_address_address2").clear();
        cy.get("#checkout_shipping_address_address2").type(
          Cypress.env("address_second")
        );

        cy.get("#checkout_shipping_address_city").clear();
        cy.get("#checkout_shipping_address_city").type(Cypress.env("city"));

        cy.get("#checkout_shipping_address_phone").clear();
        cy.get("#checkout_shipping_address_phone").type(Cypress.env("mobile"));

        cy.get("#continue_button").click();
      })
      .then(() => {
        cy.wait(250);

        cy.get("#continue_button").click();
      })
      .then(() => {
        cy.wait(250);

        cy.get(".shown-if-js > #continue_button").click();
      })
      .then(() => {
        // cy.get(".razorpay-checkout-frame").focus();
        cy.wait(550);
        getIframeBody().find("button[method=card]").click();
        getIframeBody().find("#card_number").type(Cypress.env('card_number'));
        getIframeBody().find("#card_expiry").type(Cypress.env('expiry'));
        getIframeBody().find("#card_cvv").type("050");
        getIframeBody().find("#footer-cta").click();
      });
  });
});
