describe('Navigate on talk list', function() {
    it('Check talks are loaded & displayed', function() {
        cy.visitFeedbackProject()

        cy.get('h3').should('have.length', 3)
        cy.get('body').should('contain', 'Thursday 27')

        cy.get('h3')
            .first()
            .contains('Amphi 9')
            .next()
            .within(() => {
                cy.get('a')
                    .should(
                        'have.attr',
                        'href',
                        '/xo5qvbJCpYPpU74yGW7W/2019-06-27/4'
                    )
                    .should('contain', 'Vue > React, this is why')
                    .should('contain', 'Pierre')
            })

        cy.get('h3')
            .first()
            .next()
            .within(() => {
                cy.get('a').click()
            })
        cy.get('h2').should('contain', 'Vue > React, this is why#Front')
        cy.url().should('include', '/xo5qvbJCpYPpU74yGW7W')
    })

    it('Check dates changes the displayed talks', function() {
        cy.visitFeedbackProject()

        cy.get('h3').should('have.length', 3)

        cy.contains('Friday 28')
            .should('have.attr', 'href', '/xo5qvbJCpYPpU74yGW7W/2019-06-28')
            .click()

        cy.get('h3').should('have.length', 1)

        cy.get('h3')
            .first()
            .contains('Salle 1')
            .next()
            .within(() => {
                cy.get('a')
                    .should(
                        'have.attr',
                        'href',
                        '/xo5qvbJCpYPpU74yGW7W/2019-06-28/0'
                    )
                    .should('contain', 'Un talk super bien')
                    .should('contain', 'Pierre')
            })
    })

    it('Check filter works', function() {
        cy.visitFeedbackProject()

        // Speaker
        cy.get('.search').type('Michel')
        cy.get('.session').should('have.length', 2)

        // Tags
        cy.get('.search')
            .clear()
            .type('Front')
        cy.get('.session')
            .should('have.length', 2)
            .should('contain', 'React')

        // Talk
        cy.get('.search')
            .clear()
            .type('Vue > React')
        cy.get('.session')
            .should('have.length', 1)
            .should('contain', 'Vue > React')
    })
})