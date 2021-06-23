const express = require("express");
const app = express();
app.use(express.static('public'))

app.get("/dashboard.html", (req, res) => {
  res.sendFile("/public/dashboard.html", { root: __dirname });
});
app.get("/Logo/kodoLogo.png", (req, res) => {
  res.sendFile("/public/Logo/kodoLogo.png", { root: __dirname });
});
app.get("/kodoLogo.png", (req, res) => {
  res.sendFile("/public/Logo/kodoLogo.png", { root: __dirname });
});
app.get("/summary.html", (req, res) => {
  res.sendFile("/public/summary.html", { root: __dirname });
});
app.get("/specific_result.html", (req, res) => {
  res.sendFile("/public/specific_result.html", { root: __dirname });
});

/* app.get("/users/:id", (req, res) => {
  res.sendFile("/public/user.html", { root: __dirname });
});

app.get("/users/", (req, res) => {
  res.sendFile("/public/users.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/register/", (req, res) => {
  res.sendFile("/public/register.html", { root: __dirname });
}); */

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Client server has started listening on port ${PORT}`);
});