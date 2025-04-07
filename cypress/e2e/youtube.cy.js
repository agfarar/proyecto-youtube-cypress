describe('Pruebas Extendidas en YouTube Shorts', () => {

  beforeEach(() => {
    cy.visit('https://www.youtube.com/')
    cy.wait(5000)
  })

  it('Navega a la sección de Shorts y verifica la presencia de videos', () => {
    cy.contains('Shorts').click()
    cy.url().should('include', 'shorts')
    cy.get('ytd-rich-grid-media', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
  })

  it('Reproduce el primer video de Shorts y verifica detalles en la página del video', () => {
    const searchTerm = 'Shorts'
    cy.contains('Shorts').click()
    cy.url().should('include', 'shorts')
    
    cy.get('ytd-rich-grid-media', { timeout: 10000 })
      .first()
      .find('a#thumbnail')
      .first()
      .click()
    
    cy.url().should('include', 'watch')
    cy.wait(5000)
    
    cy.get('video', { timeout: 10000 }).should('exist')
    
    cy.get('h1.title.style-scope.ytd-video-primary-info-renderer')
      .should('be.visible')
      .and('not.be.empty')
    
    cy.get('ytd-toggle-button-renderer')
      .contains(/me gusta/i)
      .should('be.visible')
    
    cy.get('span.view-count.style-scope.ytd-video-view-count-renderer')
      .should('be.visible')
      .and('match', /\d+\s*views/i)
  })

  it('Verifica que al hacer scroll se carguen más videos en Shorts', () => {
    cy.contains('Shorts').click()
    cy.url().should('include', 'shorts')
    
    cy.get('ytd-rich-grid-media', { timeout: 10000 }).then(($videosIniciales) => {
      const countInicial = $videosIniciales.length
  
      cy.scrollTo('bottom')
      cy.wait(3000)
      
      cy.get('ytd-rich-grid-media', { timeout: 10000 })
        .its('length')
        .should('be.greaterThan', countInicial)
    })
  })

  it('Realiza búsqueda en la barra principal y filtra resultados Shorts', () => {
    const searchTerm = 'cualquiera'
    
    cy.visit('https://www.youtube.com/')
    cy.wait(5000)
    
    cy.get('ytd-searchbox')
      .shadow()
      .find('input#search')
      .should('be.visible')
      .clear()
      .type(`${searchTerm}{enter}`)
    
    cy.url().should('include', 'results')
    
    cy.get('a#thumbnail', { timeout: 10000 })
      .filter('[href*="/shorts/"]')
      .its('length')
      .should('be.greaterThan', 0)
  })
})
