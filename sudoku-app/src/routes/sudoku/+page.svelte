

<h1>Welcome to Sudoku!</h1>

<div class="score-heading">
    <div class="difficulty">
            {#each difficulties as _, x}
                <button class={"difficulty-button " + x} on:click={() => throttle(changeDifficulty(x))}>{difficulties[x].value}</button>
            {/each}
        </div>
<div class="errors-container">{noOfErrors + "/3"}</div>
</div>

<script>

    //add digits to selected
    //add candidates
    //add difficulty button
    //add reset game
    import { load } from "./+page.server";
    import { onMount } from 'svelte';

    let difficulties = generateDifficulties();
    let defaultDifficulty = difficulties[0];
    // let zerosGrid = [ 
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}],
    //     [{value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}, {value: 0, changeAble: false}]
    // ]; 
    let grid = generateGrid();
    let noOfErrors = 0;
    // @ts-ignore
    let solvedGrid = null;
    // @ts-ignore
    let puzzles = [];
    const solutionCache = new Map();

    // @ts-ignore
    export let solvedPuzzle = [];

    onMount(() => {
        grid = generateSudokuPuzzle(grid);
    });

function generateDifficulties() {
    let difficulties = [];
    difficulties = [
        {key: "easy", value: "Easy", diffPercent: 0.3},
        {key: "medium", value: "Medium", diffPercent: 0.5},
        {key: "hard", value: "Hard", diffPercent: 0.7},
        {key: "insane", value: "Insane", diffPercent: 0.9}
    ];
    return difficulties;
}

function generateGrid() {
const grid = [];

// Iterate over each row
for (let i = 0; i < 9; i++) {
    const row = [];

    // Iterate over each column in the current row
    for (let j = 0; j < 9; j++) {
        // You can initialize each cell with whatever value you want
        // For example, here we initialize each cell with 0
        row.push({value: 0, changeAble: false, correct: true});
    }

    // Push the current row to the grid
    grid.push(row);
}
return grid;
}

// @ts-ignore
function generateSudokuPuzzle(grid) {
    // @ts-ignore
    grid.forEach(row => {
        // @ts-ignore
        row.forEach(cell => {
            cell.value = 0;
            cell.changeAble = false;
            cell.correct = true;
        });
    });

    // Generate the first row randomly
    const firstRow = generateFirstRow(grid);
    const entries = Array.from(firstRow.entries());

    for (let col = 0; col < 9; col++) {
        grid[0][col].value = entries[col][0];
    }

    // Solve the Sudoku puzzle to get the solved grid
    // @ts-ignore
    if(solvedGrid == null) {
     solvedGrid = generateSolvedSudokuGrid(grid);
     saveToFile(solvedGrid);
    } else {
        solvedGrid = selectRandomPuzzle();
    }

    // Copy the solved grid to create the puzzle grid
    // @ts-ignore
    const puzzleGrid = solvedGrid.map(row =>
        // @ts-ignore
        row.map(cell => ({ value: cell.value, changeAble: false, correct: true }))
    );

    // Define the number of cells to remove based on the desired difficulty
    const difficulty = defaultDifficulty.diffPercent;
    const totalCells = 81;
    const cellsToRemove = Math.floor(totalCells * difficulty);

    // Randomly remove numbers from the grid
    let cellsRemoved = 0;
    while (cellsRemoved < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzleGrid[row][col].value !== 0) {
            const temp = puzzleGrid[row][col].value;
            puzzleGrid[row][col].value = 0;
            puzzleGrid[row][col].changeAble = true;

            // Check if the puzzle still has a unique solution
            if (countSolutions(puzzleGrid) !== 1) {
                puzzleGrid[row][col].value = temp;
                puzzleGrid[row][col].changeAble = false;
            } else {
                cellsRemoved++;
            }
        }
    }

    return puzzleGrid;
    // const firstRow = generateFirstRow(grid);
    // const entries = Array.from(firstRow.entries());

    // for (let col = 0; col < 9; col++) {
    //     // @ts-ignore
    //     grid[0][col].value = entries[col][0];
    // }

    // const solvedGrid = generateSolvedSudokuGrid(grid);
    // solvedPuzzle = solvedGrid;

    // // Clone the solved grid to work with a copy
    // // @ts-ignore
    // const puzzleGrid = solvedGrid.map(row =>
    //     // @ts-ignore
    //     row.map(cell => ({ value: cell.value, changeAble: false, correct: true })) // Ensure each cell is an object with a 'value' property
    // );

    // // Define the number of cells to remove based on desired difficulty
    // const difficulty = defaultDifficulty.diffPercent; // Example: 50% of cells removed
    // const totalCells = 81;
    // const cellsToRemove = Math.floor(totalCells * difficulty);
    // // Randomly remove numbers from the grid
    // let cellsRemoved = 0;
    // while (cellsRemoved < cellsToRemove) {
    //     const row = Math.floor(Math.random() * 9);
    //     const col = Math.floor(Math.random() * 9);

    //     if (puzzleGrid[row][col].value !== 0) {
    //         // Temporarily remove the number for testing uniqueness
    //         const temp = puzzleGrid[row][col].value;
    //         puzzleGrid[row][col].value = 0;
    //         puzzleGrid[row][col].changeAble = true;

    //         // Check if the puzzle still has a unique solution
    //         if (countSolutions(puzzleGrid) !== 1) {
    //             // If removing the number makes the puzzle unsolvable or not unique, restore the number
    //             puzzleGrid[row][col].value = temp;
    //             puzzleGrid[row][col].changeAble = false;
    //         } else {
    //             cellsRemoved++;
    //         }
    //     }
    // }

    // // @ts-ignore
    // return puzzleGrid;
}

// @ts-ignore
// @ts-ignore
async function fetchPuzzle(difficulty) {
        try {
            const response = await fetch(`/api/puzzles?difficulty=${difficulty}`);
            const data = await response.json();
            puzzles = data;
        } catch (error) {
            console.error('Error fetching puzzle:', error);
        }
    }

// @ts-ignore
// @ts-ignore
function selectRandomPuzzle(difficulty) {
    // @ts-ignore
    const filteredPuzzles = puzzles.filter(puzzle => puzzle.difficulty === difficulty);

    if (filteredPuzzles.length === 0) {
        console.error(`No puzzles found for difficulty: ${difficulty}`);
        return null;
    }

    const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
    return filteredPuzzles[randomIndex];
}

// @ts-ignore
async function saveToFile(puzzle) {
    try {
        // Send a POST request to the server to save the puzzle
        const response = await load({
            // @ts-ignore
            body: JSON.stringify(puzzle)
        });

        if (response.status === 200) {
            console.log('Sudoku puzzle saved successfully!');
        } else {
            // @ts-ignore
            console.error('Failed to save Sudoku puzzle:', response.error);
        }
    } catch (error) {
        console.error('Error saving Sudoku puzzle:', error);
    }
}

// @ts-ignore
function generateSolvedSudokuGrid(grid) {

    // Call the backtracking solver to fill in the grid
    if (solveSudoku(grid)) {
        return grid; // Return the solved grid
    } else {
        throw new Error("Failed to generate a solved Sudoku grid.");
    }
}

// @ts-ignore
function solveSudoku(grid) {
    const emptyCell = findEmptyCell(grid);
    const row = emptyCell[0];
    const col = emptyCell[1];

    // Base case: if there are no empty cells, the Sudoku is solved
    if (row === -1 && col === -1) {
        return true;
    }

    // Try filling the empty cell with numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col].value = num;

            // Recursively solve Sudoku
            if (solveSudoku(grid)) {
                return true;
            }

            // Backtrack if the current configuration doesn't lead to a solution
            grid[row][col].value = 0;
        }
    }
    // No valid number found for the empty cell, backtrack
    return false;
}

// @ts-ignore
function generateFirstRow(grid) {

    const entries = Array.from(grid.entries());

    // Fisher-Yates shuffle algorithm
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }

    // Convert the shuffled array back to a Map
    const shuffledMap = new Map(entries);
    return shuffledMap;
}

// @ts-ignore
function countSolutions(grid) {

    const gridString = JSON.stringify(grid);

    if (solutionCache.has(gridString)) {
        return solutionCache.get(gridString);
    }

    const emptyCell = findEmptyCell(grid);
    const row = emptyCell[0];
    const col = emptyCell[1];

    // Base case: if there are no empty cells, the Sudoku is solved
    if (row === -1 && col === -1) {
        return 1; // One solution found
    }

    let totalSolutions = 0;

    // Try filling the empty cell with numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col].value = num;

            // Recursively count solutions for the updated grid
            // @ts-ignore
            totalSolutions += countSolutions(grid);

            // Backtrack after counting solutions
            grid[row][col].value = 0;
        }
    }

    

    return totalSolutions;
}

// @ts-ignore
function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col].value === 0) {
                return [row, col];
            }
        }
    }
    // If no empty cell found, return [-1, -1]
    return [-1, -1];
}

// @ts-ignore
function isValidMove(grid, row, col, num) {
    // Check if the number exists in the same row or column
    for (let i = 0; i < 9; i++) {
        if (grid[row][i].value === num || grid[i][col].value === num) {
            return false;
        }
    }

    // Check if the number exists in the same 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j].value === num) {
                return false;
            }
        }
    }

    // The move is valid
    return true;
}

//PLAYING FUNCTIONALITY

let selectedCellX = 0; 
let selectedCellY = 0; 
let selectedInput = 0;

// @ts-ignore
function checkInput(e) {
  if (!isNaN(e) && e >= 1 && e < 10) {
    return true;
  } else {
    return false;
  }
}
	
	// @ts-ignore
function handleKeydown(e) {
    if(grid[selectedCellX][selectedCellY].changeAble === true) {
        if(checkInput(e.key)) {
            selectedInput = e.key;
            grid[selectedCellX][selectedCellY].value = e.key;
            // @ts-ignore
            if(grid[selectedCellX][selectedCellY].value == solvedPuzzle[selectedCellX][selectedCellY].value) {
                grid[selectedCellX][selectedCellY].correct = true;
            }
            else {
                noOfErrors++;
                grid[selectedCellX][selectedCellY].correct = false;
            }
        }
    }
}

// Define a throttle function
// @ts-ignore
function throttle(fn) {
    let lastCall = 0;
    // @ts-ignore
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= 1000) {
            // @ts-ignore
            fn.apply(this, args);
            lastCall = now;
        }
    };
}

function resetGame() {
    // Clear the existing grid
    grid.forEach(row => {
        row.forEach(cell => {
            cell.value = 0;
            cell.correct = true;
            cell.changeAble = false;
        });
    });

    // Generate a new Sudoku puzzle
    grid = generateSudokuPuzzle(grid);
}

// @ts-ignore
function changeDifficulty(diffIndex) {
    defaultDifficulty = difficulties[diffIndex];
    console.log("HERE");
    resetGame();
// @ts-ignore
}

</script>

<svelte:window on:keydown={e=>{handleKeydown(e)}} />

<main>
    <div class="grid">
        {#each Array(9) as _, x}
            {#each Array(9) as _, y}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="cell"
                        style:margin-left={y%3==0?'5px':0}
                        style:margin-right={y%3==2?'5px':0}
                        style:margin-top={x%3==0?'5px':0}
                        style:margin-bottom={x%3==2?'5px':0}
                        style:color={grid[x][y].correct!=true?'red': grid[x][y].changeAble==true?'green':'gray'}
                        on:click={() => {selectedCellX = x; selectedCellY = y;}}
                        on:keydown={(e) => handleKeydown(e)}
                        >
                        <span class="selected">{grid[x][y].value == 0 ? "" : grid[x][y].value}</span>
                </div>
            {/each}
        {/each}
    </div>

</main>

<style>
    *{box-sizing:border-box;}
    .grid {
        display:grid;		
		grid-template-columns: repeat(9, max-content);
		grid-template-rows: repeat(9, max-content);
		justify-content:center;
		align-items:center;
		justify-items:center;
		grid-gap:5px;
		background:black;
    }

    .cell{ 
		display:inline-grid;
		grid-template-columns: repeat(3, 20px);
		grid-template-rows: repeat(3, 20px);
		align-items:stretch;
		justify-items:stretch;
		background:white;
	}

    .selected {
		font-size: 50px;
		text-align: center;
		grid-row: 1/-1;
		grid-column: 1/-1;
		cursor:pointer;
    }

    .candidate {
		border: 1px solid #0000003d;
		text-align:center;
		cursor:pointer;
	}

    main {
        margin: auto;
    }

    .errors-container {
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        font-size: 30pt;
    }
    
    .difficulty {
        display: flex;
        justify-content: center;
        gap: 0.3px;
        align-items: flex-start;
        font-size: 20pt;
    }

    .difficulty-button {
        margin: 10px;
        padding: 10px;
        border-radius: 15px;
        box-shadow: 0 4px 8px 0 rgb(0, 0, 0), 0 6px 20px 0 rgb(0, 0, 0);
        font-weight: bold;
        cursor: pointer;
    }

    .difficulty-button:hover {
        background-color: black;
        color: white;
    }

    .score-heading {
        /* display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-between;
        align-items: center; */
    }

</style>