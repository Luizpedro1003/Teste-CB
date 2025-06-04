module.exports = {
  e2e: {

    setupNodeEvents(on, config) {
      // implement node event listeners here
       

    },
    specPattern: [
      '**/fluxo_de_compra.cy.js',
      '**/dummyjson_carrinho_api.cy.js'
    ],
    defaultCommandTimeout: 20000
  },
};
