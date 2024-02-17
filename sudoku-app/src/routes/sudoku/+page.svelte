

<h1>Welcome to Sudoku!</h1>

<script>
    let grid = [ 
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}],
    [{value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}, {value: 0}]
];

let puzzle = [
[0, 3, 0, 0, 0, 1, 0, 7, 0],
[6, 0, 0, 8, 0, 0, 0, 0, 2],
[0, 0, 1, 0, 4, 0, 5, 0, 0],
[0, 7, 0, 0, 0, 2, 0, 4, 0],
[2, 0, 0, 0, 9, 0, 0, 0, 6],
[0, 4, 0, 3, 0, 0, 0, 1, 0],
[0, 0, 5, 0, 3, 0, 4, 0, 0],
[1, 0, 0, 0, 0, 6, 0, 0, 5],
[0, 2, 0, 1, 0, 0, 0, 3, 0]
];

for(let i = 0; i < 9; i++) {
    for(let j = 0; j < 9; j++) {
        if(puzzle[i][j] !== 0) {
            grid[i][j].value = puzzle[i][j];
        }
    }
}

let value = 0; 
// @ts-ignore
let pressed = [];

let selectedCellX = 0; 
let selectedCellY = 0; 
let selectedInput = 0;

// for(let i = 0; i < 9; i++) {
//     for(let j = 0; j < 9; j++) {
//         grid[i][j] = 0;
//     }
// }

// let value = 0;

// @ts-ignore
function checkInput(e) {
    console.log(e);
  if (!isNaN(e) && e >= 1 && e < 10) {
    return true;
  } else {
    return false;
  }
}
	
	// @ts-ignore
function handleKeydown(e) {
    if(checkInput(e.key)) {
        selectedInput = e.key;
        grid[selectedCellX][selectedCellY].value = e.key;
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