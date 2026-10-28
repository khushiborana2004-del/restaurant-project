
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Food = require("./models/Food");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Khushi's Restaurant Backend is Running!");
});

// POST: Add new food
app.post("/foods", async (req, res) => {
    try {
        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Get all foods
app.get("/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Update food
console.log("PUT ROUTE REGISTERED");
app.put("/foods/:id", async (req, res) => {
    console.log("PUT REQUEST RECEIVED:", req.params.id);

    try {
        const food = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!food) {
            return res.status(404).json({
                message: "Food not found. Please check the food ID."
            });
        }

        res.status(200).json({
            message: "Food updated successfully!",
            food: food
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Delete food
app.delete("/foods/:id", async (req, res) => {
    console.log("DELETE REQUEST RECEIVED:", req.params.id);

    try {
        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({
                message: "Food not found. Please check the food ID."
            });
        }

        res.status(200).json({
            message: "Food deleted successfully!",
            food: food
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(5001, () => {
            console.log("Server started at http://localhost:5001");
            console.log("POST, GET, PUT and DELETE routes are ready!");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });
