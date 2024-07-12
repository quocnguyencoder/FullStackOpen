import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    await createBlog({ title, author, url });
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Paper
      component="form"
      onSubmit={addBlog}
      sx={{
        width: "50vw",
        padding: "16px",
      }}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={2}>
        <Box textAlign="center">
          <Typography variant="h5" color={"primary"}>
            New blog
          </Typography>
        </Box>
        <TextField
          label="Title"
          data-testid="blog-title-input"
          type="text"
          value={title}
          fullWidth
          onChange={({ target }) => setTitle(target.value)}
        />

        <TextField
          label="Author"
          data-testid="blog-author-input"
          type="text"
          value={author}
          fullWidth
          onChange={({ target }) => setAuthor(target.value)}
        />

        <TextField
          label="URL"
          data-testid="blog-url-input"
          type="text"
          value={url}
          fullWidth
          onChange={({ target }) => setUrl(target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          data-testid="create-blog-button"
          type="submit"
          fullWidth
        >
          Create
        </Button>
      </Stack>
    </Paper>
  );
};

export default BlogForm;
