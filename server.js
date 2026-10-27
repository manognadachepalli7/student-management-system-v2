const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

// GET
app.get("/students", async (req, res) => {
  try {
    await client.connect();

    const db = client.db("manogna_32089");
    const collection = db.collection("students");

    const students = await collection.find({}).toArray();

    res.json(students);
  } catch (error) {
    res.status(500).send("Error connecting to MongoDB");
  }
});

// POST
app.post("/students", async (req, res) => {
  try {
    await client.connect();

    const db = client.db("manogna_32089");
    const collection = db.collection("students");

    const result = await collection.insertOne(req.body);

    res.json({
      message: "Student added successfully",
      insertedId: result.insertedId
    });
  } catch (error) {
    res.status(500).send("Error adding student");
  }
});

// PUT
app.put("/students/:name", async (req, res) => {
  try {
    await client.connect();

    const db = client.db("manogna_32089");
    const collection = db.collection("students");

    const result = await collection.updateOne(
      { name: req.params.name },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("Student not found");
    }

    res.json({
      message: "Student updated successfully"
    });
  } catch (error) {
    res.status(500).send("Error updating student");
  }
});

// DELETE
app.delete("/students/:name", async (req, res) => {
  try {
    await client.connect();

    const db = client.db("manogna_32089");
    const collection = db.collection("students");

    const result = await collection.deleteOne({
      name: req.params.name
    });

    if (result.deletedCount === 0) {
      return res.status(404).send("Student not found");
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(500).send("Error deleting student");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});