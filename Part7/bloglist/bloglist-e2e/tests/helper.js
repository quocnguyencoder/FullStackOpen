const loginWith = async (page, username, password) => {
  await page.getByTestId("username-input").fill(username);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("login-button").click();
};

const createBlogWith = async (page, title, author, url) => {
  const viewButton = page.getByText("create new blog");
  await viewButton.click();
  const blogTitleInput = page.getByTestId("blog-title-input");
  const blogAuthorInput = page.getByTestId("blog-author-input");
  const blogUrlInput = page.getByTestId("blog-url-input");
  const createBlogButton = page.getByTestId("create-blog-button");
  await blogTitleInput.fill(title);
  await blogAuthorInput.fill(author);
  await blogUrlInput.fill(url);
  await createBlogButton.click();
};

const verifyBlogOrder = async (page, expect, expectedOrder) => {
  const blogItems = page.locator(".blog-item");
  for (let i = 0; i < expectedOrder.length; i++) {
    const blogItem = blogItems.nth(i);
    await blogItem.getByTestId("view-button").click();
    await expect(blogItem).toContainText(expectedOrder[i]);
  }
};

const likeBlog = async (page, index, likeCount = 1) => {
  const blogItems = page.locator(".blog-item");
  const blogItem = blogItems.nth(index);

  const viewButton = blogItem.getByTestId("view-button");
  const viewButtonText = await viewButton.innerText();
  if (viewButtonText.includes("view")) {
    await viewButton.click();
  }

  for (let i = 0; i < likeCount; i++) {
    await blogItem.getByTestId("like-button").click();
  }
};

export { loginWith, createBlogWith, verifyBlogOrder, likeBlog };
