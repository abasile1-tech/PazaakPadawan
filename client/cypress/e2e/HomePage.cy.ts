describe('Home Page', () => {
  it('can get the hero heading h1 on the home page', () => {
    cy.visit('http://localhost:5173')
    cy.get("[data-testid='hero-heading']").contains("Pazaak Padawan")
  })
})