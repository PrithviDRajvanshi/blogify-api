const express = require("express");
const app = express();

const postsRouter = require("./routes/posts.routes");
const usersRouter = require("./routes/user.routes");

app.get("/", (req, res) => {
  res.send("Blogify API is running!");
});

app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
