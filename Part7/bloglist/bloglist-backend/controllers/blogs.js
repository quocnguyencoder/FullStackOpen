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

  const populatedBlog = await Blog.findById(savedBlog._id).populate("user");

  response.status(201).json(populatedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (blog) {
      if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(request.params.id);
        user.blogs = user.blogs.filter(
          (id) => id.toString() !== blog.id.toString()
        );
        await user.save();
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
  }).populate("user");

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const body = request.body;

  if (!body.comment) {
    return response.status(400).json({ error: "invalid comment" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      $push: { comments: body.comment },
    },
    { new: true }
  ).populate("user");

  if (!updatedBlog) {
    return response.status(404).end();
  }

  response.json(updatedBlog);
});

module.exports = blogsRouter;
