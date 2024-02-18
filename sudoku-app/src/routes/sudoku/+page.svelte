

<h1>Welcome to Sudoku!</h1>

<script>

    //add digits to selected
    //add errors
    //add error checking
    //add candidates
    //add difficulty button

    import { onMount } from 'svelte';


    // let grid = [ 
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

    // @ts-ignore
    export let solvedPuzzle = [];

    onMount(() => {
        grid = generateSudokuPuzzle(grid);
    });

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
    const firstRow = generateFirstRow(grid);
    const entries = Array.from(firstRow.entries());

    for (let col = 0; col < 9; col++) {
        // @ts-ignore
        grid[0][col].value = entries[col][0];
    }

    const solvedGrid = generateSolvedSudokuGrid(grid);
    solvedPuzzle = solvedGrid;

    // Clone the solved grid to work with a copy
    // @ts-ignore
    const puzzleGrid = solvedGrid.map(row =>
        // @ts-ignore
        row.map(cell => ({ value: cell.value, changeAble: false, correct: true })) // Ensure each cell is an object with a 'value' property
    );

    // Define the number of cells to remove based on desired difficulty
    const difficulty = 0.5; // Example: 50% of cells removed
    const totalCells = 81;
    const cellsToRemove = Math.floor(totalCells * difficulty);
    // Randomly remove numbers from the grid
    let cellsRemoved = 0;
    while (cellsRemoved < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (puzzleGrid[row][col].value !== 0) {
            // Temporarily remove the number for testing uniqueness
            const temp = puzzleGrid[row][col].value;
            puzzleGrid[row][col].value = 0;
            puzzleGrid[row][col].changeAble = true;

            // Check if the puzzle still has a unique solution
            if (countSolutions(puzzleGrid) !== 1) {
                // If removing the number makes the puzzle unsolvable or not unique, restore the number
                puzzleGrid[row][col].value = temp;
                puzzleGrid[row][col].changeAble = false;
            } else {
                cellsRemoved++;
            }
        }
    }

    // @ts-ignore
    return puzzleGrid;
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
                console.log("HERE");
                grid[selectedCellX][selectedCellY].correct = true;
            }
            else {
                grid[selectedCellX][selectedCellY].correct = false;
            }
        }
    }
}

</script>

<svelte:window on:keydown={e=>{handleKeydown(e)}} />

<main>
    <!-- <div class="root">
        {#each grid as row, i}
            <div class="row">
                {#each row as column, j}
                    <span class="column" 
                    style:margin-left={j%3==0 ? '5px' : 0}
                    style:margin-right={j%3==2 ? '5px' : 0}
                    style:margin-top={i%3==0 ? '5px' : 0}
                    style:margin-bottom={i%3==2 ? '5px' : 0}
                    >
                        <input
                        class="col-input"
                        type="text"
                        inputmode="numeric"
                        pattern="[1-9.]*"
                        bind:value="{grid[i][j]}"
                        on:input|preventDefault={updateValue}
                        />
                    </span>
                {/each}
            </div>
        {/each}
    </div> -->

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

    /* .inner-value {
        font-size: 20pt;
    } */

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

</style>