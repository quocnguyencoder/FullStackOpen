const { describe, test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

const initialBlogs = [
  {
    title: "test blog 1",
    author: "test author 1",
    url: "test url 1",
    likes: 1,
  },
  {
    title: "test blog 2",
    author: "test author 2",
    url: "test url 2",
    likes: 2,
  },
  {
    title: "test blog 3",
    author: "test author 3",
    url: "test url 3",
    likes: 3,
  },
];

describe("Blog API tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("test_password", 10);
    const newUser = {
      username: "test_user",
      passwordHash,
      name: "test_name",
    };

    const user = new User(newUser);
    const userInfo = await user.save();

    await Blog.deleteMany({});

    let blogIds = [];
    for (let blog of initialBlogs) {
      let blogObject = new Blog({ ...blog, user: userInfo._id });
      const savedBlog = await blogObject.save();
      blogIds.push(savedBlog._id);
    }

    await User.findByIdAndUpdate(
      userInfo._id,
      { $set: { blogs: blogIds } },
      { new: true }
    );
  });

  describe("GET /api/blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("unique identifier is named id", async () => {
      const response = await api.get("/api/blogs");
      const idsCheck = response.body.every((blog) => blog.id);
      assert.equal(idsCheck, true);
    });
  });

  describe("POST /api/blogs", () => {
    let token;

    beforeEach(async () => {
      const loginInfo = await api
        .post("/api/login")
        .send({ username: "test_user", password: "test_password" });

      token = `Bearer ${loginInfo.body.token}`;
    });

    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "test blog 3",
        author: "test author 3",
        url: "test url 3",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .set({ Authorization: token })
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length + 1);
    });

    test("if the likes property is missing from the request, it will default to the value 0", async () => {
      const newBlog = {
        title: "test blog 3",
        author: "test author 3",
        url: "test url 3",
      };

      await api
        .post("/api/blogs")
        .set({ Authorization: token })
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body[initialBlogs.length].likes, 0);
    });

    test("if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request", async () => {
      const newBlog = {
        author: "test author 3",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .set({ Authorization: token })
        .send(newBlog)
        .expect(400);
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    let token;

    beforeEach(async () => {
      const loginInfo = await api
        .post("/api/login")
        .send({ username: "test_user", password: "test_password" });

      token = `Bearer ${loginInfo.body.token}`;
    });

    test("succeeds with status code 204", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;

      await api
        .delete(`/api/blogs/${id}`)
        .set({ Authorization: token })
        .expect(204);
    });

    test("delete correct blog", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;
      await api
        .delete(`/api/blogs/${id}`)
        .set({ Authorization: token })
        .expect(204);
      const response2 = await api.get("/api/blogs");

      // check if the blog has been deleted
      assert.strictEqual(
        response2.body.length === initialBlogs.length - 1 &&
          response2.body.every((blog) => blog.id !== id),
        true
      );
    });

    test("nonexistent blog cannot be deleted", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;
      await api
        .delete(`/api/blogs/${id}`)
        .set({ Authorization: token })
        .expect(204);
      await api
        .delete(`/api/blogs/${id}`)
        .set({ Authorization: token })
        .expect(204);

      // check no blog has been deleted
      const response2 = await api.get("/api/blogs");
      assert.strictEqual(response2.body.length, initialBlogs.length - 1);
    });
  });

  describe("PUT /api/blogs/:id", () => {
    test("a valid blog can be updated", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;
      const newBlogContent = {
        title: "test blog 3",
        author: "test author 3",
        url: "test url 3",
        likes: 3,
      };
      await api.put(`/api/blogs/${id}`).send(newBlogContent).expect(200);
    });
    test("blog is updated correctly", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;
      const newBlogContent = {
        title: "test blog 3",
        author: "test author 3",
        url: "test url 3",
        likes: 3,
      };
      const updateResult = await api
        .put(`/api/blogs/${id}`)
        .send(newBlogContent)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      delete updateResult.body.user;
      assert.deepStrictEqual(updateResult.body, { ...newBlogContent, id });
    });
    test("invalid blog cannot be updated", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;
      const newBlogContent = {
        likes: "3",
      };
      await api.put(`/api/blogs/${id}`).send(newBlogContent).expect(400);
    });
    test("nonexistent blog cannot be updated", async () => {
      const response = await api.get("/api/blogs");
      const id = response.body[0].id;
      await Blog.findOneAndDelete(id);

      const newBlogContent = {
        title: "test blog 3",
        author: "test author 3",
        url: "test url 3",
        likes: 3,
      };
      await api.put(`/api/blogs/${id}`).send(newBlogContent).expect(404);
    });
    test("invalid id cannot be updated", async () => {
      await api.put("/api/blogs/invalidId").expect(400);
    });
  });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
