const bcrypt = require("bcrypt");
const User = require("../models/user");
const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const helper = require("../utils/user_helper");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "test112",
      name: "test112",
      passwordHash,
    });
    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    if (usersAtStart.length !== 1) {
      throw new Error("only one user should initially exist in test");
    }

    const newUser = {
      username: "quoc",
      name: "Quoc Nguyen",
      password: "12345",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  describe("creation fails with proper statuscode and message if", () => {
    test("username is missing", async () => {
      const userAtStart = await helper.usersInDb();

      const newUser = {
        name: "Superuser",
        password: "salainen",
      };
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(result.body.error.includes("`username` is required"));
      assert.strictEqual(usersAtEnd.length, userAtStart.length);
    });

    test("password is missing", async () => {
      const userAtStart = await helper.usersInDb();

      const newUser = {
        username: "1",
        name: "Superuser",
      };
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(result.body.error.includes("`password` is required"));
      assert.strictEqual(usersAtEnd.length, userAtStart.length);
    });

    test("username is less than 3 characters", async () => {
      const userAtStart = await helper.usersInDb();
      const newUser = {
        username: "1",
        name: "Superuser",
        password: "salainen",
      };
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes(
          "username must be at least 3 characters long"
        )
      );
      assert.strictEqual(usersAtEnd.length, userAtStart.length);
    });

    test("password is less than 3 characters ", async () => {
      const userAtStart = await helper.usersInDb();
      const newUser = {
        username: "123",
        name: "Superuser",
        password: "12",
      };
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();

      assert(
        result.body.error.includes(
          "password must be at least 3 characters long"
        )
      );
      assert.strictEqual(usersAtEnd.length, userAtStart.length);
    });

    test("username already taken", async () => {
      const userAtStart = await helper.usersInDb();
      const newUser = {
        username: "test112",
        name: "Superuser",
        password: "salainen",
      };
      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));

      assert.strictEqual(usersAtEnd.length, userAtStart.length);
    });
  });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
