import { faker } from "@faker-js/faker";

export default function itemFactory() {
  return {
    title: faker.lorem.words(),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    amount: faker.datatype.number(100),
  };
}
