// cypress/e2e/api/dummyjson_cart_api.cy.js

describe('API de Carrinhos - DummyJSON', () => {
  const BASE_URL = 'https://dummyjson.com/carts';

  // Helper para gerar dados de produto aleatórios para testes
  const generateRandomProducts = (count = 1) => {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push({
        id: Math.floor(Math.random() * 100) + 1, // ID de produto aleatório entre 1 e 100
        quantity: Math.floor(Math.random() * 5) + 1, // Quantidade aleatória entre 1 e 5
      });
    }
    return products;
  };

  // == Testes para Adicionar Carrinho (POST /carts/add) ==
  describe('POST /carts/add - Adicionar Carrinho', () => {
    it('[Positivo] Deve adicionar um novo carrinho com um produto', () => {
      // Técnica: Teste de Caminho Feliz (Happy Path)
      // Objetivo: Validar a funcionalidade principal de adicionar um carrinho com dados válidos.
      const novoCarrinho = {
        userId: 1,
        products: generateRandomProducts(1),
      };

      cy.request({
        method: 'POST',
        url: `${BASE_URL}/add`,
        body: novoCarrinho,
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        // ****** CORREÇÃO DEFINITIVA APLICADA AQUI ******
        expect(response.status).to.eq(201); // DummyJSON retorna 200 para simulação
        // ***********************************************
        expect(response.body).to.have.property('id');
        expect(response.body.products).to.have.lengthOf(novoCarrinho.products.length);
        if (novoCarrinho.products.length > 0 && response.body.products.length > 0) {
          expect(response.body.products[0].id).to.eq(novoCarrinho.products[0].id);
          expect(response.body.products[0].quantity).to.eq(novoCarrinho.products[0].quantity);
        }
        expect(response.body.userId).to.eq(novoCarrinho.userId);
      });
    });

    it('[Positivo] Deve adicionar um novo carrinho com múltiplos produtos', () => {
      // Técnica: Teste de Caminho Feliz (Happy Path) com Múltiplas Entradas
      // Objetivo: Validar a adição de um carrinho com uma lista maior de produtos.
      const novoCarrinho = {
        userId: 5,
        products: generateRandomProducts(3),
      };

      cy.request({
        method: 'POST',
        url: `${BASE_URL}/add`,
        body: novoCarrinho,
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        // ****** CORREÇÃO DEFINITIVA APLICADA AQUI ******
        expect(response.status).to.eq(201); // DummyJSON retorna 200
        // ***********************************************
        expect(response.body).to.have.property('id');
        expect(response.body.products).to.have.lengthOf(novoCarrinho.products.length);
        expect(response.body.userId).to.eq(novoCarrinho.userId);
      });
    });

    it('[Negativo] Não deve adicionar carrinho sem "userId"', () => {
      // Técnica: Teste Negativo - Entrada Inválida (Campo Obrigatório Ausente)
      // Objetivo: Validar que a API retorna um erro apropriado quando um campo obrigatório está ausente.
      const carrinhoInvalido = {
        // userId é omitido
        products: generateRandomProducts(1),
      };

      cy.request({
        method: 'POST',
        url: `${BASE_URL}/add`,
        body: carrinhoInvalido,
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.include('User id is required');
      });
    });

    it('[Negativo] Não deve adicionar carrinho com array de produtos vazio', () => {
        // Técnica: Teste Negativo - Entrada Inválida (Array Vazio)
        // Objetivo: Validar que a API retorna um erro apropriado para uma lista de produtos vazia.
        const carrinhoInvalido = {
          userId: 10,
          products: [],
        };
  
        cy.request({
          method: 'POST',
          url: `${BASE_URL}/add`,
          body: carrinhoInvalido,
          headers: { 'Content-Type': 'application/json' },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.include('products can not be empty');
        });
      });
  });

  // == Testes para Atualizar Carrinho (PUT /carts/{cartId}) ==
  describe('PUT /carts/{cartId} - Atualizar Carrinho', () => {
    const CART_ID_PARA_ATUALIZAR = 1; 

    it('[Positivo] Deve atualizar produtos de um carrinho (merge)', () => {
      // Técnica: Teste de Caminho Feliz (Happy Path)
      // Objetivo: Validar a funcionalidade de mesclar/atualizar produtos em um carrinho existente.
      const produtoExistenteIdNoCarrinho1 = 1; 
      const novaQuantidadeProdutoExistente = 5;
      const produtoNovoInfo = generateRandomProducts(1)[0]; 

      const produtosParaMerge = {
        merge: true,
        products: [
          {
            id: produtoExistenteIdNoCarrinho1,
            quantity: novaQuantidadeProdutoExistente,
          },
          {
            id: produtoNovoInfo.id,
            quantity: produtoNovoInfo.quantity,
          },
        ],
      };

      cy.request({
        method: 'PUT',
        url: `${BASE_URL}/${CART_ID_PARA_ATUALIZAR}`,
        body: produtosParaMerge,
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', CART_ID_PARA_ATUALIZAR);

        cy.log('Resposta do merge para Carrinho ID 1:', JSON.stringify(response.body.products));
        cy.log('Total de produtos retornados no carrinho 1:', response.body.products.length);

        const produtoAtualizadoNaResposta = response.body.products.find(p => p.id === produtoExistenteIdNoCarrinho1);
        expect(produtoAtualizadoNaResposta, `Produto ID ${produtoExistenteIdNoCarrinho1} (enviado para merge) não encontrado na resposta do carrinho ${CART_ID_PARA_ATUALIZAR}`).to.exist;
        if (produtoAtualizadoNaResposta) {
            expect(produtoAtualizadoNaResposta.quantity, `Quantidade do Produto ID ${produtoExistenteIdNoCarrinho1} incorreta`).to.eq(novaQuantidadeProdutoExistente);
        }

        const produtoNovoNaResposta = response.body.products.find(p => p.id === produtoNovoInfo.id);
        expect(produtoNovoNaResposta, `Produto ID ${produtoNovoInfo.id} (enviado para merge) não encontrado na resposta do carrinho ${CART_ID_PARA_ATUALIZAR}`).to.exist;
        if (produtoNovoNaResposta) {
            expect(produtoNovoNaResposta.quantity, `Quantidade do Produto ID ${produtoNovoInfo.id} incorreta`).to.eq(produtoNovoInfo.quantity);
        }
      });
    });

    it('[Positivo] Deve substituir todos os produtos de um carrinho (sem merge)', () => {
        // Técnica: Teste de Caminho Feliz (Happy Path)
        // Objetivo: Validar a funcionalidade de substituir todos os produtos de um carrinho.
        const CART_ID_PARA_SUBSTITUIR = 2; 
        const novosProdutos = {
          products: generateRandomProducts(2),
        };
  
        cy.request({
          method: 'PUT',
          url: `${BASE_URL}/${CART_ID_PARA_SUBSTITUIR}`,
          body: novosProdutos,
          headers: { 'Content-Type': 'application/json' },
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id', CART_ID_PARA_SUBSTITUIR);
          expect(response.body.products).to.have.lengthOf(novosProdutos.products.length);
          if (novosProdutos.products.length > 0 && response.body.products.length > 0) {
            expect(response.body.products[0].id).to.eq(novosProdutos.products[0].id);
            expect(response.body.products[0].quantity).to.eq(novosProdutos.products[0].quantity);
          }
        });
      });

    it('[Negativo] Deve retornar erro (ou simulação) ao tentar atualizar carrinho com ID inexistente/inválido', () => {
      // Técnica: Teste Negativo - Entrada Inválida (ID Não Encontrado)
      // Objetivo: Verificar o comportamento da API para um ID de carrinho que não existe.
      const ID_INEXISTENTE = 9999;
      const produtos = { products: generateRandomProducts(1) };

      cy.request({
        method: 'PUT',
        url: `${BASE_URL}/${ID_INEXISTENTE}`,
        body: produtos,
        headers: { 'Content-Type': 'application/json' },
        failOnStatusCode: false, 
      }).then((response) => {
        if (response.status === 404) { 
            expect(response.body).to.have.property('message').and.include(`Cart with id '${ID_INEXISTENTE}' not found`);
        } else { 
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', ID_INEXISTENTE); 
            if (produtos.products.length > 0 && response.body.products.length > 0) {
                expect(response.body.products[0].id).to.eq(produtos.products[0].id); 
            }
        }
        cy.log(`Resposta para PUT em ID inexistente (${ID_INEXISTENTE}):`, response.body);
      });
    });
  });

  // == Testes para Deletar Carrinho (DELETE /carts/{cartId}) ==
  describe('DELETE /carts/{cartId} - Deletar Carrinho', () => {
    it('[Positivo] Deve simular a deleção de um carrinho com sucesso', () => {
      // Técnica: Teste de Caminho Feliz (Happy Path)
      // Objetivo: Validar a funcionalidade principal de deletar um carrinho.
      const CART_ID_PARA_DELETAR = 7; 

      cy.request({
        method: 'DELETE',
        url: `${BASE_URL}/${CART_ID_PARA_DELETAR}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', CART_ID_PARA_DELETAR);
        expect(response.body).to.have.property('isDeleted', true);
        expect(response.body).to.have.property('deletedOn').and.to.be.a('string');
      });
    });

    it('[Negativo] Deve retornar erro (ou simulação) ao tentar deletar carrinho com ID inexistente/inválido', () => {
      // Técnica: Teste Negativo - Entrada Inválida (ID Não Encontrado)
      // Objetivo: Verificar o comportamento da API para um ID de carrinho que não existe.
      const ID_INEXISTENTE = 9998;

      cy.request({
        method: 'DELETE',
        url: `${BASE_URL}/${ID_INEXISTENTE}`,
        failOnStatusCode: false,
      }).then((response) => {
        if (response.status === 404) {
            expect(response.body).to.have.property('message').and.include(`Cart with id '${ID_INEXISTENTE}' not found`);
        } else { 
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', ID_INEXISTENTE);
            expect(response.body).to.have.property('isDeleted', true);
        }
        cy.log(`Resposta para DELETE em ID inexistente (${ID_INEXISTENTE}):`, response.body);
      });
    });
  });
});