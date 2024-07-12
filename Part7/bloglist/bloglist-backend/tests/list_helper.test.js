const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { listWithOneBlog, blogs } = require("./data/blogs");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });
  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("of empty list is undefined", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, undefined);
  });

  test("when list has only one blog, the favorite one is that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, listWithOneBlog[0]);
  });

  test("when list has multiple blogs with unique likes, the favorite one is the one with the most likes", () => {
    const expectedFavorite = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    };
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, expectedFavorite);
  });

  test("when list has multiple blogs with the same number of likes, the favorite one is any one of them", () => {
    const multipleFavoriteBlogs = [
      {
        title: "First blog",
        author: "Author 1",
        url: "http://example.com/blog1",
        likes: 7,
        id: "1",
      },
      {
        title: "Second blog",
        author: "Author 2",
        url: "http://example.com/blog2",
        likes: 7,
        id: "2",
      },
    ];
    const result = listHelper.favoriteBlog(multipleFavoriteBlogs);
    assert.ok(
      result.id === "1" || result.id === "2",
      "Favorite blog should be one of the blogs with the highest likes"
    );
  });
});

describe("most blogs", () => {
  test("of empty list is undefined", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, undefined);
  });

  test("when list has only one blog, the author of that blog is returned with blogs count 1", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    const expected = {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    };
    assert.deepStrictEqual(result, expected);
  });

  test("when list has multiple blogs, the author with the most blogs is returned", () => {
    const result = listHelper.mostBlogs(blogs);
    const expected = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    assert.deepStrictEqual(result, expected);
  });

  test("when multiple authors have the same highest number of blogs, any one of them is returned", () => {
    const blogsWithTiedAuthors = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://example.com/blog1",
        likes: 5,
        id: "1",
      },
      {
        title: "Blog 2",
        author: "Author 1",
        url: "http://example.com/blog2",
        likes: 7,
        id: "2",
      },
      {
        title: "Blog 3",
        author: "Author 2",
        url: "http://example.com/blog3",
        likes: 10,
        id: "3",
      },
      {
        title: "Blog 4",
        author: "Author 2",
        url: "http://example.com/blog4",
        likes: 3,
        id: "4",
      },
    ];
    const result = listHelper.mostBlogs(blogsWithTiedAuthors);
    assert.ok(
      (result.author === "Author 1" && result.blogs === 2) ||
        (result.author === "Author 2" && result.blogs === 2),
      "Most blogs should be one of the authors with the highest number of blogs"
    );
  });
});

describe("most likes", () => {
  test("of empty list is undefined", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, undefined);
  });

  test("when list has only one blog, the author of that blog is returned with the total likes of that blog", () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 5,
    };
    assert.deepStrictEqual(result, expected);
  });

  test("when list has multiple blogs, the author with the most likes is returned", () => {
    const result = listHelper.mostLikes(blogs);
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    assert.deepStrictEqual(result, expected);
  });

  test("when multiple authors have the same highest number of likes, any one of them is returned", () => {
    const blogsWithTiedLikes = [
      {
        title: "Blog 1",
        author: "Author 1",
        url: "http://example.com/blog1",
        likes: 10,
        id: "1",
      },
      {
        title: "Blog 2",
        author: "Author 1",
        url: "http://example.com/blog2",
        likes: 5,
        id: "2",
      },
      {
        title: "Blog 3",
        author: "Author 2",
        url: "http://example.com/blog3",
        likes: 15,
        id: "3",
      },
      {
        title: "Blog 4",
        author: "Author 2",
        url: "http://example.com/blog4",
        likes: 0,
        id: "4",
      },
    ];
    const result = listHelper.mostLikes(blogsWithTiedLikes);
    const expectedAuthor1 = { author: "Author 1", likes: 15 };
    const expectedAuthor2 = { author: "Author 2", likes: 15 };
    const validResults = [expectedAuthor1, expectedAuthor2];

    const isValidResult = validResults.some(
      (expected) =>
        result.author === expected.author && result.likes === expected.likes
    );

    assert.strictEqual(
      isValidResult,
      true,
      "Most likes should be one of the authors with the highest number of likes"
    );
  });
});
