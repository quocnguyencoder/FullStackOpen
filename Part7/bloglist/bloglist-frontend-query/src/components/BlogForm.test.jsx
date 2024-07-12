import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("New blog form calls event handler with correct details on blog creation", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const title = screen.getByTestId("blog-title-input");
  const author = screen.getByTestId("blog-author-input");
  const url = screen.getByTestId("blog-url-input");
  const button = screen.getByTestId("create-blog-button");

  await user.type(
    title,
    "Component testing is done with react-testing-library",
  );
  await user.type(author, "Alex");
  await user.type(url, "https://reactpatterns.com/");
  await user.click(button);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Component testing is done with react-testing-library",
    author: "Alex",
    url: "https://reactpatterns.com/",
  });
});
