const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ import model (Step 4.1)
const Expense = require("./models/Expense");

// ✅ MongoDB connection
mongoose.connect("mongodb+srv://Ashish:Ashu%40123@cluster0.xdpoln3.mongodb.net/expenseDB")
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log(err));

// ✅ test route
app.get("/", (req, res) => {
  res.send("Server is working");
});


// 🔥 STEP 4.2 → ADD API (WRITE HERE)
app.post("/add", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ GET ALL EXPENSES
app.get("/all", async (req, res) => {
  try {
    const data = await Expense.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE EXPENSE
app.delete("/delete/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ UPDATE EXPENSE
app.put("/update/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns updated data
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ start server (always last)
app.listen(5000, () => {
  console.log("Server running on port 5000");
});