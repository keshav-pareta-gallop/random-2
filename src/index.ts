import app from "./app.js";

const port = parseInt(process.env["PORT"] ?? "8080", 10);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
