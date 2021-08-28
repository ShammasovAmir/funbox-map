describe('Marker List', () => {
  beforeEach(() => cy.visit('/'))

  it('focuses input on load', () => cy.get('input').should('be.focused'))

  it('accepts input', () => {
    const typedText = 'New marker'
    cy.get('input').type(typedText).should('have.value', typedText)
  })

  it('Create markers', () => {
    const markerAmount = 4
    for (let i = 0; i < markerAmount; i++) {
      cy.get('input').type('Marker').type('{enter}')
    }
    cy.get('ul').find('li#singleMarker').should('have.length', 4)
  })

  it('Delete markers', () => {
    cy.get('input').type('Marker').type('{enter}')
    cy.get('button#closeBtn').click()
    cy.get('ul').find('li#singleMarker').should('have.length', 0)
  })
})
