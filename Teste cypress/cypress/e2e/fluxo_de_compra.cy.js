describe('fluxo de compra', () => {
  it('passes', () => {
    cy.viewport(1920, 1080);
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

    //ADICIONAR PRODUTOS NA SACOLA
    cy.contains('.item-description', 'Peça de 380g de corte especial de raças britânicas que leva nossa assinatura no nome. Acompanha batata palha e cole slaw.').click()
    cy.contains('button', 'ADICIONAR').first().click()

    //DETALHES DO PEDIDO
    cy.contains('.bag-button-items-quantity', 'Ver sacola').click()
    cy.contains('Previsão de entrega').should('be.visible')

    //SELECIONAR FORMA DE PAGAMENTO
    cy.get('.choose-payment-method-button').click()
    cy.get("ion-segment-button[class='ng-star-inserted md in-segment segment-button-layout-icon-top ion-activatable ion-activatable-instant ion-focusable hydrated']").click()
    cy.contains("Dinheiro").click()

    //CONFIRMAR PEDIDO
    cy.contains("CONFIRMAR PEDIDO").click()
    cy.get("button[class='action-sheet-button ion-activatable ion-focusable action-sheet-cancel sc-ion-action-sheet-md']").click()
    cy.contains("CONFIRMAR E FAZER PEDIDO").click()

    //FINALIZANDO O PEDIDO
    cy.contains('Seu pedido foi enviado, aguarde o recebimento').should('be.visible')
    cy.get("span[class='confirm-label']").click()
    cy.get("button[class='is-primary']").click()
    cy.contains('Concluído').should('be.visible')




  })
})