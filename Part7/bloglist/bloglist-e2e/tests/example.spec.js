const { test, expect, beforeEach, describe } = require("@playwright/test");
const {
  loginWith,
  createBlogWith,
  verifyBlogOrder,
  likeBlog,
} = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "admin",
        username: "admin",
        password: "admin",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const loginForm = page.locator("form");
    await expect(loginForm).toBeVisible();
    await expect(loginForm).toHaveCount(1);
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "admin", "admin");

      const loggedInUserInfo = page.getByTestId("logged-in-user-info");
      await expect(loggedInUserInfo).toBeVisible();
      await expect(loggedInUserInfo).toHaveText("admin logged in");
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "admin", "wrong-password");

      const errorMessage = page.getByTestId("login-form-error-message");
      await expect(errorMessage).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "admin", "admin");
    });
    test("a new blog can be created", async ({ page }) => {
      await createBlogWith(
        page,
        "Test blog",
        "Test author",
        "https://test.com"
      );
      const blogItems = page.locator(".blog-item");

      await expect(blogItems).toHaveCount(1);
      const blogItem = blogItems.nth(0);
      await expect(blogItem).toContainText(`Test blog - Test author`);
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlogWith(
        page,
        "Test blog",
        "Test author",
        "https://test.com"
      );

      const blogItems = page.locator(".blog-item");
      const firstBlog = blogItems.nth(0);
      await firstBlog.getByTestId("view-button").click();
      await firstBlog.getByTestId("like-button").click();
      await expect(firstBlog).toContainText("likes 1");
    });

    test("a blog can be deleted", async ({ page }) => {
      //create blog
      await createBlogWith(
        page,
        "Test blog",
        "Test author",
        "https://test.com"
      );

      // Set up a listener for the dialog event
      page.on("dialog", async (dialog) => {
        // Check the dialog type and message, then accept it
        if (
          dialog.type() === "confirm" &&
          dialog.message() === "Remove blog Test blog by Test author?"
        ) {
          await dialog.accept();
        }
      });
      //select blog
      const blogItems = page.locator(".blog-item");
      const firstBlog = blogItems.nth(0);
      //view details
      await firstBlog.getByTestId("view-button").click();
      const deleteButton = firstBlog.getByTestId("delete-button");
      //check if delete button is visible
      await expect(deleteButton).toBeVisible();

      //click delete button
      await deleteButton.click();

      //check if blog is deleted
      await expect(blogItems).toHaveCount(0);
    });

    test("only the creator of a blog can see the delete button", async ({
      page,
      request,
    }) => {
      //create blog
      await createBlogWith(
        page,
        "Test blog",
        "Test author",
        "https://test.com"
      );
      //select blog
      const blogItems = page.locator(".blog-item");
      const firstBlog = blogItems.nth(0);
      //view details
      await firstBlog.getByTestId("view-button").click();
      const deleteButton = firstBlog.getByTestId("delete-button");
      //check if delete button is visible
      await expect(deleteButton).toBeVisible();
      const logoutButton = page.getByTestId("logout-button");
      await logoutButton.click();
      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "another user",
          username: "another-user",
          password: "another-user",
        },
      });
      await loginWith(page, "another-user", "another-user");
      await firstBlog.getByTestId("view-button").click();
      //check if delete button is not visible
      await expect(deleteButton).toBeHidden();
    });

    test("blogs are ordered according to likes", async ({ page }) => {
      const blogItems = page.locator(".blog-item");
      // Create blogs
      await createBlogWith(
        page,
        "Test blog 1",
        "Test author 1",
        "https://test.com"
      );

      await expect(blogItems).toHaveCount(1);
      await createBlogWith(
        page,
        "Test blog 2",
        "Test author 2",
        "https://test.com"
      );
      await expect(blogItems).toHaveCount(2);
      await createBlogWith(
        page,
        "Test blog 3",
        "Test author 3",
        "https://test.com"
      );
      await expect(blogItems).toHaveCount(3);

      // check initial order
      await verifyBlogOrder(page, expect, [
        "Test blog 1",
        "Test blog 2",
        "Test blog 3",
      ]);

      // like the last blog
      await likeBlog(page, 2);
      //check order
      await verifyBlogOrder(page, expect, [
        "Test blog 3",
        "Test blog 1",
        "Test blog 2",
      ]);

      // like the first blog
      await likeBlog(page, 0);
      //check order
      await verifyBlogOrder(page, expect, [
        "Test blog 3",
        "Test blog 1",
        "Test blog 2",
      ]);

      //like the last blog
      await likeBlog(page, 2);
      //check order
      await verifyBlogOrder(page, expect, [
        "Test blog 3",
        "Test blog 2",
        "Test blog 1",
      ]);
    });
  });
});
