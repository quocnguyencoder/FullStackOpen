const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const sortedBlogs = _.orderBy(blogs, ["likes"], ["desc"]);

  return sortedBlogs[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorBlogCounts = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(
    Object.keys(authorBlogCounts),
    (author) => authorBlogCounts[author]
  );

  return {
    author: topAuthor,
    blogs: authorBlogCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});
  const topAuthor = _.maxBy(
    Object.keys(likesByAuthor),
    (author) => likesByAuthor[author]
  );
  return { author: topAuthor, likes: likesByAuthor[topAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
