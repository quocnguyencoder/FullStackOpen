const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;

  if (!blog.title || !blog.url) {
    return response
      .status(400)
      .json({ error: "title, author, and url are required" });
  }

  if (!blog.likes) blog.likes = 0;

  blog.user = user._id;

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(blog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (blog) {
      if (user.blogs.includes(blog.id.toString())) {
        user.blogs = user.blogs.filter(
          (id) => id.toString() !== blog.id.toString()
        );
        await user.save();
        await Blog.findByIdAndDelete(request.params.id);
      } else {
        return response.status(401).json({ error: "unauthorized" });
      }
    }

    response.status(204).end();
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  if (
    !blog.title ||
    !blog.url ||
    !blog.author ||
    !blog.likes ||
    typeof blog.likes !== "number"
  ) {
    return response.status(400).json({ error: "invalid blog" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

module.exports = blogsRouter;
