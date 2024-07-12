import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

test("Blog component renders title and author, but not URL or likes by default", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Alex",
    url: "https://reactpatterns.com/",
    likes: 0,
  };
  render(<Blog blog={blog} updateBlog={() => null} deleteBlog={() => null} />);

  const title = screen.getByText(
    "Component testing is done with react-testing-library",
  );
  const author = screen.getByText("Alex");
  expect(title).toBeDefined();
  expect(author).toBeDefined();

  const url = screen.queryByText("https://reactpatterns.com/");
  const likes = screen.queryByText("likes 0");
  expect(url).toBeNull();
  expect(likes).toBeNull();
});

test("Blog component shows URL and likes when details button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Alex",
    url: "https://reactpatterns.com/",
    likes: 0,
    user: { name: "alex" },
  };
  const mockHandler = vi.fn();

  render(
    <Blog blog={blog} updateBlog={mockHandler} deleteBlog={mockHandler} />,
  );

  const user = userEvent.setup();
  const button = screen.getByTestId("view-button");
  await user.click(button);

  const likes = screen.getByTestId("likes");
  const url = screen.getByTestId("url");
  expect(likes).toHaveTextContent("likes 0");
  expect(url).toHaveTextContent("https://reactpatterns.com/");
});

test("Like button click calls event handler twice when clicked twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Alex",
    url: "https://reactpatterns.com/",
    likes: 0,
    user: { name: "alex" },
  };
  const mockUpdateHandler = vi.fn();
  const mockDeleteHandler = vi.fn();

  render(
    <Blog
      blog={blog}
      updateBlog={mockUpdateHandler}
      deleteBlog={mockDeleteHandler}
    />,
  );

  const user = userEvent.setup();
  const viewDetailButton = screen.getByTestId("view-button");
  await user.click(viewDetailButton);
  const likeButton = screen.getByTestId("like-button");

  const numberOfClicks = 2;

  for (let i = 0; i < numberOfClicks; i++) {
    await user.click(likeButton);
  }

  expect(mockUpdateHandler.mock.calls).toHaveLength(numberOfClicks);
});
