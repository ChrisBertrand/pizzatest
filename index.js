const fs = require("fs");
const inputFile = "./input/a_example.in";

// Read data from file
var data = fs.readFileSync(inputFile, "utf-8");
var dataByLine = data.split("\n");

// Establish parameters
var firstRow = dataByLine[0].split(" ");
const rows = firstRow[0];
const columns = firstRow[1];
const minIngredients = firstRow[2];
const maxCells = firstRow[3];

// TODO Read data into 2D array