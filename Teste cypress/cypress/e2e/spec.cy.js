describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://app-hom.cocobambu.com/entrar')

    //LOGIN
    cy.contains('Seja bem-vindo ao melhor restaurante do Brasil!').should('be.visible')
    cy.get("#ion-input-2").type('luizzpedroca@gmail.com')
    cy.get("#ion-input-3").type('Lp.99778201')
    cy.contains("ENTRAR").click()

    //AUTENTICAÇÃO
    cy.contains('CÓDIGO ENVIADO').should('be.visible')
    cy.contains("FECHAR").click()
    const codigo = "AAAAAA";
    cy.get('input[id^="otp_0_"]').type(codigo[0]);
    cy.get('input[id^="otp_1_"]').type(codigo[1]);
    cy.get('input[id^="otp_2_"]').type(codigo[2]);
    cy.get('input[id^="otp_3_"]').type(codigo[3]);
    cy.get('input[id^="otp_4_"]').type(codigo[4]);
    cy.get('input[id^="otp_5_"]').type(codigo[5]);
    cy.contains("ACESSAR").click()

    //PÁGINA INICIAL
    cy.contains('Endereço de entrega').should('be.visible')


  })
})