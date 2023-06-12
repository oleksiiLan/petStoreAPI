export function getCheck() {
    cy.request("GET", `/pet/${pet.id}`).then((response) => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(pet.id);
        expect(response.body.name).to.be.equal(pet.name);
        expect(response.body.category.id).to.be.equal(pet.category.id);
        expect(response.body.category.name).to.be.equal(pet.category.name);
      });
}