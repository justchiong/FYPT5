const express = require("express");
const app = express();
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile("/public/dashboard.html", { root: __dirname });
});
app.get("/build/pdfmake.min.js", (req, res) => {
  res.sendFile("/pdfmake/build/pdfmake.min.js", { root: __dirname });
});
app.get("/build/vfs_fonts.js", (req, res) => {
  res.sendFile("/pdfmake/build/vfs_fonts.js", { root: __dirname });
});
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
app.get("/summary.css", (req, res) => {
  res.sendFile("/public/summary.css", { root: __dirname });
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