import app from "../src/app";
import supertest from "supertest";

import { prisma } from "../src/database";
import itemFactory from "../prisma/itemFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items RESTART IDENTITY CASCADE`;
});

describe("Test POST /items ", () => {
  it("should return status 201 if created an item with correct format", async () => {
    const item = itemFactory();

    const result = await supertest(app).post("/items").send(item);

    expect(result.status).toBe(201);
  });

  it("should return status 409 if send an item with title that already exists", async () => {
    const item = itemFactory();

    await supertest(app).post("/items").send(item);
    const result = await supertest(app).post("/items").send(item);

    expect(result.status).toBe(409);
  });
});

describe("Test GET /items ", () => {
  it("should return status 200 and the body in Array format", async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);

    const result = await supertest(app).get("/items");

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Test GET /items/:id ", () => {
  it("should return status 200 and the same object that was created", async () => {
    const item = itemFactory();
    const result = await supertest(app).post("/items").send(item);

    const idItemCreated = result.body.id;
    const resultGet = await supertest(app).get(`/items/${idItemCreated}`);

    expect(resultGet.status).toBe(200);
    expect(resultGet.body).toEqual(result.body);
  });

  it("should return status 404 if the item with that ID doesn't exist", async () => {
    const item = itemFactory();
    const result = await supertest(app).post("/items").send(item);

    const idItemCreated = result.body.id;
    const resultGet = await supertest(app).get(`/items/${idItemCreated + 1}`);

    expect(resultGet.status).toBe(404);
  });

  it.todo("Deve retornar status 404 caso não exista um item com esse id");
});
