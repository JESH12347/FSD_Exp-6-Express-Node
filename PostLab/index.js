const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────
app.use(express.json()); // parse JSON request bodies
app.use(morgan("dev")); // log every request in the terminal

// ── In-memory "database" ─────────────────────
// (No real DB needed for this lab – just an array)
let students = [
  { id: 1, name: "Jeshrun Dethe", branch: "CSE", year: 2 },
  { id: 2, name: "Kate Middleton", branch: "ECE", year: 2 },
  { id: 3, name: "Jennifer Smith", branch: "ME", year: 2 },
];

let nextId = 4; // auto-increment counter for new students

// ════════════════════════════════════════════
//  ROUTES
// ════════════════════════════════════════════

// ── GET /students ─────────────────────────────
// Returns the full list of students
app.get("/students", (req, res) => {
  res.json(students);
});

// ── GET /students/:id ─────────────────────────
// Returns one student by ID
app.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id); // URL param is always a string, convert to number
  const student = students.find((s) => s.id === id); // search the array

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// ── POST /students ────────────────────────────
// Adds a new student
app.post("/students", (req, res) => {
  const { name, branch, year } = req.body; // get data sent by client

  // Basic validation – all three fields are required
  if (!name || !branch || !year) {
    return res
      .status(400)
      .json({ message: "Please provide name, branch, and year" });
  }

  const newStudent = {
    id: nextId++, // assign and then increment the counter
    name,
    branch,
    year,
  };

  students.push(newStudent); // add to our "database"
  res.status(201).json(newStudent); // 201 = Created
});

// ── PATCH /students/:id ───────────────────────
// Updates only the fields that are sent (partial update)
app.patch("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Destructure only the allowed fields from the request body
  const { name, branch, year } = req.body;

  // Update only if a value was actually sent
  if (name) student.name = name;
  if (branch) student.branch = branch;
  if (year) student.year = year;

  res.json(student); // send back the updated student
});

// ── DELETE /students/:id ──────────────────────
// Removes a student from the list
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id); // get position in array

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students.splice(index, 1); // remove 1 element at that position
  res.json({ message: "Student deleted successfully" });
});

// ── Start the server ──────────────────────────
app.listen(PORT, () => {
  console.log(`\n Server running at http://localhost:${PORT}`);
  console.log(` Try: GET http://localhost:${PORT}/students\n`);
});
