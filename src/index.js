const express = require("express");
const app = express();
const PORT = 3000;
const postsRouter = require("./routes/posts.routes");

app.get("/", (req, res) => {
  res.send("Blogify API is running!");
});

app.use("/api/v1/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});