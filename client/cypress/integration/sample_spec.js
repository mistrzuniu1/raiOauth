describe('The Home Page', function() {
    it('successfully loads', function() {
        cy.visit('http://localhost:8080/');
    });
    it('could not login with wrong password', function () {
        cy.visit('http://localhost:8080/login');

        const randomNumb = (Math.random()*100).toString()
        cy.get(':nth-child(1) > .form-control').type(randomNumb+'km');
        cy.get(':nth-child(2) > .form-control').type('123');

        cy.get('.btn').click();
        cy.url().should('eq', 'http://localhost:8080/login')
    })

    it('could not login with wrong password', function () {
        cy.visit('http://localhost:8080/login');

        cy.get(':nth-child(1) > .form-control').type('km');
        cy.get(':nth-child(2) > .form-control').type('123');

        cy.get('.btn').click();
        cy.url().should('eq', 'http://localhost:8080/')
    })

    it('could not login without one form', function () {
        cy.visit('http://localhost:8080/login');

        cy.get(':nth-child(2) > .form-control').type('123');

        cy.get('.btn').click();
        cy.url().should('eq', 'http://localhost:8080/login')
    })




});
