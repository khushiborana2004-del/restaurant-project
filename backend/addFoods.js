
require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/Food");

const foods = [
    {
        name: "Pizza",
        price: 199,
        image: "",
        description: "Delicious cheese pizza"
    },
    {
        name: "Burger",
        price: 99,
        image: "",
        description: "Fresh and tasty burger"
    },
    {
        name: "Pasta",
        price: 149,
        image: "",
        description: "Creamy white sauce pasta"
    },
    {
        name: "French Fries",
        price: 79,
        image: "",
        description: "Crispy golden fries"
    }
];

async function addFoods() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Food.insertMany(foods);
        console.log("Food items added successfully!");
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

addFoods();
