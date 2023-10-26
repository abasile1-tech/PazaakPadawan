describe('Solo Game', () => {
  it('can navigate to the Solo Game page from the Home Page', () => {
    cy.visit('http://localhost:5173')
    cy.get("[data-testid='solo-game-button']").click()
    cy.location().should((loc) => {
      expect(loc.href).to.eq("http://localhost:5173/solo");
    });
  })
})