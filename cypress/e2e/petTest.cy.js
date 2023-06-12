import pet from "../fixtures/pet.json";
import { faker } from "@faker-js/faker";
import { getCheck } from '../support/helper' 

pet.id = faker.number.int();
pet.name = faker.animal.cat.name;
pet.category.id = faker.number.int(3);
pet.category.name = faker.animal.type();

it("Create pet", () => {
  //cy.log(JSON.stringify(pet));//виводить масив обєкта який створився з фейкером
  //cy.request('POST','/pet',pet)//перевірка
  cy.log(`Create pet with id:${pet.id}`);
  cy.log(JSON.stringify(pet));
  cy.request("POST", "/pet", pet).then((response) => {
    expect(response.status).to.be.equal(200);//перевірка на статус 200
    expect(response.body.id).to.be.equal(pet.id);//id-шник відповідає тому що засетапив
    expect(response.body.name).to.be.equal(pet.name);//перевірка імені
  });
});

it("GET pet by id", () => {
  cy.log(`GET pet with id:${pet.id}`);

  //getCheck();
  cy.request("GET", `/pet/${pet.id}`).then((response) => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  });
});

it("UPDATE pet", () => {
  cy.log(`Get pet with id:${pet.id}`);

  pet.name = "Batman";
  pet.status = "sold";
  cy.request("PUT", "/pet", pet).then((response) => {//the same as on create a pet
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.status).to.be.equal(pet.status);
  });
  //getCheck();
  cy.request("GET", `/pet/${pet.id}`).then((response) => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  });
});

it("Find pet by status", () => {
  cy.log(`Find pet with id:${pet.id}`);

  cy.request("GET", `/pet/findByStatus?status=${pet.status}`).then(
    response => {
      expect(response.status).to.be.equal(200);
      
      let pets = response.body; //filter example
      let resulstPetArray = pets.filter((myPet) => {
      //кожен ел масива то додаємо в резалт
         return myPet.id === pet.id;//порівняти, якщо айдішник співпадає - додаємо в резалт
      });

      expect(resulstPetArray[0]).to.be.eql(pet);
      //console.log(response.body[0].id);
    }
  );
});

it("Request formData", () => {
    cy.log(`Updates a pet in the store with form data:${pet.id}`);
  
    cy.request({
      method: 'POST',
      url: `/pet/${pet.id}`, // baseUrl is prepend to URL
      form: true, 
      body: {
        id: 111111111111111,
        name: 'updatedBigBoy',
        status: 'pending',
      }
    })
    cy.request("GET", `/pet/${pet.id}`).then((response) => {
      expect(response.status).to.be.equal(200);

      pet.id = response.body.id;
      pet.name = response.body.name;
      pet.status = response.body.status;

      expect(response.body.id).to.be.equal(pet.id);
      expect(response.body.name).to.be.equal(pet.name);
      expect(response.body.status).to.be.equal(pet.status);
    });
});

it("Delete a pet", () => {
  cy.log(`Delete a pet:${pet.id}`);

  cy.request({
    method: 'DELETE',
    url: `/pet/${pet.id}`
  });

  cy.request({
    method: 'GET',
    url: `/pet/${pet.id}`,
    failOnStatusCode: false // якщо запит не успішний
  }).then((response) => {
    expect(response.status).to.be.equal(404); // іефегі 404
  });
});