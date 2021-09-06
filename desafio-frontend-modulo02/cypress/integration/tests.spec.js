describe('Busca', function() {
  it('Busca só funciona com a tecla Enter', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');

    cy.get('.input').type('Matrix');

    cy.get('.movie__title')
      .should('contain', 'O Esquadrão Suicida')
  });

  it('Limpa o filtro após a busca', function() {
    cy.visit('http://localhost:5000');

    cy.get('.input').type('Matrix{enter}');

    cy.get('.input')
      .should('contain', '');
  });

  it('Limpa a busca se o filtro for vazio', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');

    cy.get('.btn-next').click();

    cy.get('.input').type('{enter}');

    cy.get('.movie__title')
      .should('contain', 'O Esquadrão Suicida');
  });

  it('Renderiza os resultados filtrados', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=Matrix', 
    { fixture: 'matrix-search.json' }).as('buscaMatrix');

    cy.visit('http://localhost:5000');

    cy.get('.input').type('Matrix{enter}');

    cy.wait('@buscaMatrix');

    cy.get('.movie__title')
      .should('contain', 'Matrix')
  });
});

describe('Highlight', function() {
  it('Highlight é renderizado', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR', 
    { fixture: 'highlight-movie.json' }).as('buscaHighlight');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaHighlight');

    cy.get('.highlight__title')
      .should('contain', 'O Esquadrão Suicida');

    cy.get('.highlight__genres')
      .should('contain', 'Ação, Aventura, Fantasia');

    cy.get('.highlight__description')
      .should('contain', 'Os supervilões Harley Quinn (Margot Robbie), Bloodsport (Idris Elba), Peacemaker (John Cena) e uma coleção de malucos condenados da prisão de Belle Reve juntam-se à super-secreta e super-obscura Força Tarefa X, enquanto são deixados na remota ilha de Corto Maltese para combater o inimigo.');
  });

  it('Vídeo do Highlight está correto', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR', 
    { fixture: 'highlight-video.json' }).as('buscaVideoHighlight');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaVideoHighlight');

    cy.get('.highlight__video-link')
      .should('have.attr', 'href', 'https://www.youtube.com/watch?v=VO_oW4GDy7o')
  });
});

describe('Modal', function() {
  it('Modal é aberto', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');
    
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR', 
    { fixture: 'highlight-movie.json' }).as('buscaFilme');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');

    cy.get('.movie')
      .first()
      .click();
    
    cy.wait('@buscaFilme');

    cy.get('.modal__title')
      .should('contain', 'O Esquadrão Suicida');

    cy.get('.modal__img')
      .should('have.attr', 'src', 'https://image.tmdb.org/t/p/original/jlGmlFOcfo8n5tURmhC7YVd4Iyy.jpg');
  });

  it('Modal é fechado (clique no Modal)', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');
    
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR', 
    { fixture: 'highlight-movie.json' }).as('buscaFilme');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');

    cy.get('.movie')
      .first()
      .click();
    
    cy.wait('@buscaFilme');

    cy.get('.modal')
      .click();

    cy.get('.modal')
      .should('have.css', 'display', 'none');
  });

  it('Modal é fechado (clique no X)', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');
    
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR', 
    { fixture: 'highlight-movie.json' }).as('buscaFilme');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');

    cy.get('.movie')
      .first()
      .click();
    
    cy.wait('@buscaFilme');

    cy.get('.modal__close')
      .click();

    cy.get('.modal')
      .should('have.css', 'display', 'none');
  });
});

describe('Paginação', function() {
  it('Proxima página é renderizada', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');
    
    cy.get('.btn-next').click();

    cy.get('.movie')
      .first()
      .should('contain', 'Infinito');
  });

  it('Página anterior é renderizada', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');
    
    cy.get('.btn-next').click();

    cy.get('.btn-prev').click({ force: true });

    cy.get('.movie')
      .first()
      .should('contain', 'O Esquadrão Suicida');
  });

  it('Voltar da primeira página leva o usuário para a ultima', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');
    
    cy.get('.btn-prev').click({ force: true });

    cy.get('.movie')
      .first()
      .should('contain', 'O Homem nas Trevas 2');
  });

  it('Avançar da ultima página leva o usuário para a primeira', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');
    
    cy.get('.btn-next').click();
    cy.get('.btn-next').click();
    cy.get('.btn-next').click();
    cy.get('.btn-next').click();

    cy.get('.movie')
      .first()
      .should('contain', 'O Esquadrão Suicida');
  });
});

describe('Troca de tema', function() {
  it('Troca de tema claro para escuro com sucesso', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');
    
    cy.get('.btn-theme').click();

    cy.get('.btn-theme')
      .should('have.attr', 'src', './assets/dark-mode.svg');

    cy.get('body')
      .should('have.css', 'background-color', "rgb(36, 36, 36)");

    cy.get('.input')
      .should('have.css', 'background-color', "rgb(36, 36, 36)");
  });

  it('Troca de tema escuro para claro com sucesso', function() {
    cy.intercept('GET', 
    'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false', 
    { fixture: 'base-movies.json' }).as('buscaPadrao');

    cy.visit('http://localhost:5000');
    
    cy.wait('@buscaPadrao');
    
    cy.get('.btn-theme').click();
    cy.get('.btn-theme').click();

    cy.get('.btn-theme')
      .should('have.attr', 'src', './assets/light-mode.svg');

    cy.get('body')
      .should('have.css', 'background-color', "rgb(255, 255, 255)");

    cy.get('.input')
      .should('have.css', 'background-color', "rgb(255, 255, 255)");
  });
});