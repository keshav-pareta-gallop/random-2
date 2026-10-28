import app from "./app";

const PORT = parseInt(process.env.PORT || "8080", 10);

app.listen(PORT, () => {
  console.log(`Acme Shop API listening on port ${PORT}`);
});
