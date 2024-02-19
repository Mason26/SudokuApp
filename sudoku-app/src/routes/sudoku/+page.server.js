// sudoku.server.js

import { writeFile, readFile } from "fs/promises";

// Define the path to the file storing Sudoku puzzles
const filePath = "./sudokuPuzzles.json";

// Endpoint to store Sudoku puzzles
// @ts-ignore
export async function load(req) {
  try {
    // Extract the Sudoku puzzle from the request body
    // @ts-ignore
    const puzzle = req.body;

    // Read existing puzzles from the file
    let existingPuzzles = [];
    try {
      const data = await readFile(filePath, "utf-8");
      existingPuzzles = JSON.parse(data);
    } catch (error) {
      console.error("Error reading Sudoku puzzles file:", error);
    }

    // Add the new puzzle to the existing list
    existingPuzzles.push(puzzle);

    // Write the updated list back to the file
    await writeFile(
      filePath,
      JSON.stringify(existingPuzzles, null, 2),
      "utf-8"
    );

    return {
      status: 200,
      body: { message: "Sudoku puzzle stored successfully!" },
    };
  } catch (error) {
    console.error("Error storing Sudoku puzzle:", error);
    return {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
}

// Endpoint to retrieve Sudoku puzzles
export async function actions() {
  try {
    // Read Sudoku puzzles from the file
    const data = await readFile(filePath, "utf-8");
    const puzzles = JSON.parse(data);

    return {
      status: 200,
      body: puzzles,
    };
  } catch (error) {
    console.error("Error retrieving Sudoku puzzles:", error);
    return {
      status: 500,
      body: { error: "Internal server error" },
    };
  }
}
