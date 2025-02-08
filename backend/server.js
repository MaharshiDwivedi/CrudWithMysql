const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "*", // Change this to your frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "sql202.infinityfree.com",
  user: "if0_38269436", 
  password: "maharshi9933", 
  database: "if0_38269436_cruddb",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Create a User
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  db.query(
    "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
    [name, email, age],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ message: "User created", id: result.insertId });
    }
  );
});

// Read Users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Update a User
app.put("/users/:id", (req, res) => {
  const { name, email, age } = req.body;
  db.query(
    "UPDATE users SET name=?, email=?, age=? WHERE id=?",
    [name, email, age, req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "User updated" });
    }
  );
});

// Delete a User
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User deleted" });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

