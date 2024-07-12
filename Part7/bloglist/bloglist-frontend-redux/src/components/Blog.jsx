import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

const Blog = ({ blog }) => {
  const avatar = createAvatar(lorelei, {
    seed: blog.author,
    backgroundColor: ["b6e3f4"],
  });

  const svg = avatar.toDataUri();
  const randomImageUrl = `https://picsum.photos/seed/${blog.id}/400/200`;
  return (
    <Card className="blog-item" variant="outlined">
      <CardHeader
        titleTypographyProps={{ variant: "body1", fontWeight: "bold" }}
        avatar={<Avatar src={svg} />}
        title={blog.author}
      />
      <CardMedia
        component="img"
        height="140"
        image={randomImageUrl}
        sx={{ objectFit: "cover" }}
        alt={blog.title}
      />
      <CardContent>
        <Link
          component={RouterLink}
          to={`/blogs/${blog.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="h5" component="div">
            {blog.title}
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Blog;
