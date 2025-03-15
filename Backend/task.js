const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "puepue",
  password: "123456",
  database: "taskdatabase",
});

// Check MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
  connection.release();
});

// Insert Task
app.post("/taskfunction", (req, res) => {
  const { tasklist, taskstatus, taskcomplete, taskaction } = req.body;

  if (!tasklist || !taskstatus || !taskcomplete || !taskaction) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO tbl_task (tasklist, taskstatus, taskcomplete, taskaction) VALUES (?, ?, ?, ?)";
  pool.query(sql, [tasklist, taskstatus, taskcomplete, taskaction], (err) => {
    if (err) {
      console.error("Failed to insert record:", err);
      return res.status(500).json({ error: "Failed to insert record" });
    }
    console.log("Task inserted successfully");
    res.json({ message: "Task added successfully" });
  });
});

// Get All Tasks
app.get("/getTaskData", (req, res) => {
  const sql = "SELECT * FROM tbl_task ORDER BY id DESC";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch data:", err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
    res.json(results);
  });
});

// Update Task
app.put("/editfunction/:id", (req, res) => {
  const { id } = req.params;
  const { tasklist, taskstatus, taskcomplete, taskaction } = req.body;

  if (!tasklist || !taskstatus || !taskcomplete || !taskaction) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "UPDATE tbl_task SET tasklist = ?, taskstatus = ?, taskcomplete = ?, taskaction = ? WHERE id = ?";
  pool.query(
    sql,
    [tasklist, taskstatus, taskcomplete, taskaction, id],
    (err) => {
      if (err) {
        console.error("Failed to update task:", err);
        return res.status(500).json({ error: "Failed to update task" });
      }
      console.log("Task updated successfully");
      res.json({ message: "Task updated successfully" });
    }
  );
});

// Delete Task
app.delete("/deletefunction/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tbl_task WHERE id = ?";
  pool.query(sql, [id], (err) => {
    if (err) {
      console.error("Failed to delete task:", err);
      return res.status(500).json({ error: "Failed to delete task" });
    }
    console.log("Task deleted successfully");
    res.json({ message: "Task deleted successfully" });
  });
});

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Task Manager API");
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
