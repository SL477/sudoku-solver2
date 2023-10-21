/*By solving all fifty puzzles find the sum of the 3-digit numbers found in the top left
corner of each solution grid; for example, 483 is the 3-digit number found in the top
left corner of the solution grid above.*/

//import fs from 'fs';
const fs = require("fs");
//import readline from 'readline';
const readline = require("readline");

const SudokuSolver = require("../controllers/sudoku-solver");

async function main(){
    //const orgData = fs.readFileSync("convertedPuzzles.txt").toString();
    const fileStream = fs.createReadStream("convertedPuzzles.txt");

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const solver = new SudokuSolver();

    for await (const line of rl) {
        //console.log(`'${line.trim()}'`, line.trim().length);
        const solution = solver.solve(line.trim())
        if (solution['solution']) {
            console.log(solution['solution']);
        }
        else {
            console.log(line.trim());
        }
    }
}

main();