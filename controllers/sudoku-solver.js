class SudokuSolver {
    /**
     * Check that the cell is in 1-9
     * @param input{string}
     * @returns{bool}
     */
    isInputValid(input) {
        const pattern = /[1-9]/;
        return input && input.length == 1 && pattern.test(input);
    }

    /**
     * Check that a sudoku is valid
     * @param puzzleString{string}
     * @returns{boolean}
     */
    validate(puzzleString) {
        const pattern = /[^1-9.]/;
        if (puzzleString.length !== 81) {
            return { error: 'Expected puzzle to be 81 characters long' };
        } else if (pattern.test(puzzleString)) {
            return { error: 'Invalid characters in puzzle' };
        }
        return true;
    }

    /**
     * Get which panel an index belongs to
     * @param index{number}
     * @returns{number}
     */
    getBoxNumber(index) {
        const boxNumbers = [
            0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1,
            1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 3, 3, 3, 4, 4, 4, 5, 5, 5, 3,
            3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 6, 6, 6, 7, 7, 7,
            8, 8, 8, 6, 6, 6, 7, 7, 7, 8, 8, 8,
        ];
        return boxNumbers[index];
    }

    /**
     * Convert a row to a number
     * @param row{string} Needs to be A-I
     * @returns{number}
     */
    getRowNumber(row) {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        return rows.findIndex((r) => {
            return r === row;
        });
    }

    /**
     * Convert a column number to a number
     * @param col{string} Needs to be 1-9
     * @returns{number}
     */
    getColumnNumber(col) {
        const cols = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        return cols.findIndex((r) => {
            return r === col;
        });
    }

    /**
   * Convert to row and column
   * @param value{string}
   * @returns{{
    row: null;
    column: null;
} | {
    error: string;
}}
   */
    getRowColumn(value) {
        // Value in form of A1-I9
        const pattern = /[A-I][1-9]/;
        if (!value || value.length !== 2 || !pattern.test(value)) {
            return { error: 'Invalid coordinate' };
        }

        return {
            row: this.getRowNumber(value[0]),
            column: this.getColumnNumber(value[1]),
        };
    }

    /**
     * Get the possibilities for a row
     * @param row{number} The row to check
     * @param puzzle{string} The puzzle
     * @returns{string[]}
     */
    getPossibilitiesForRow(row, puzzle) {
        const ret = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let i = 0; i < 9; i++) {
            const number = puzzle[i + 9 * row];
            if (this.isInputValid(number)) {
                const index = ret.indexOf(number);
                ret.splice(index, 1);
            }
        }
        return ret;
    }

    /**
     * Check what possibilities are allowed in a row
     * @param puzzleString{string}
     * @param row{number}
     * @param column{number}
     * @param value{number}
     * @returns{boolean}
     */
    checkRowPlacement(puzzleString, row, column, value) {
        //Returns true/false
        const possibilitiesInRow = this.getPossibilitiesForRow(
            row,
            puzzleString
        );
        return possibilitiesInRow.includes(String(value));
    }

    /**
     * Allowed values in column
     * @param col{number}
     * @param puzzle{string}
     * @returns{string[]}
     */
    getPossibilitiesForColumn(col, puzzle) {
        const ret = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (let i = 0; i < 9; i++) {
            const number = puzzle[col + 9 * i];
            // console.log('number',number)
            if (this.isInputValid(number)) {
                const index = ret.indexOf(number);
                // console.log('index', index);
                ret.splice(index, 1);
            }
        }
        return ret;
    }

    /**
     * Check that the value is allowed in the column
     * @param puzzleString{string}
     * @param row{number}
     * @param column{number}
     * @param value{number}
     * @returns{boolean}
     */
    checkColPlacement(puzzleString, row, column, value) {
        const possibilitiesCol = this.getPossibilitiesForColumn(
            column,
            puzzleString
        );
        return possibilitiesCol.includes(value.toString());
    }

    /**
     * Get the allowed values for the box
     * @param num{number} The box index
     * @param puzzleString{string}
     * @returns{string[]}
     */
    getPossibilitiesForBox(num, puzzleString) {
        const boxStarts = [0, 3, 6, 27, 30, 33, 54, 57, 60];
        const offset = [0, 1, 2, 9, 10, 11, 18, 19, 20];
        const ret = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        for (var i = 0; i < 9; i++) {
            const number = puzzleString[boxStarts[num] + offset[i]];
            // console.log('number',number)
            if (this.isInputValid(number)) {
                const index = ret.indexOf(number);
                // console.log('index', index);
                ret.splice(index, 1);
            }
        }
        return ret;
    }

    /**
     * Check the value in the region
     * @param puzzleString{string}
     * @param row{number}
     * @param column{number}
     * @param value{number}
     * @returns{boolean}
     */
    checkRegionPlacement(puzzleString, row, column, value) {
        const index = row * 9 + column;
        const boxNum = this.getBoxNumber(index);
        const possibilitiesBox = this.getPossibilitiesForBox(
            boxNum,
            puzzleString
        );
        return possibilitiesBox.includes(value.toString());
    }

    /**
     * Get the allowed values for a cell
     * @param index{number}
     * @param puzzleString{string}
     */
    getPossibilitiesForCell(index, puzzleString) {
        if (this.isInputValid(puzzleString[index])) {
            return [];
        }
        const columnPossibilities = this.getPossibilitiesForColumn(
            index % 9,
            puzzleString
        );
        const rowPossibilities = this.getPossibilitiesForRow(
            Math.floor(index / 9),
            puzzleString
        );
        const boxPossibilities = this.getPossibilitiesForBox(
            this.getBoxNumber(index),
            puzzleString
        );

        const mergeColumnAndRow = columnPossibilities.filter((value) =>
            rowPossibilities.includes(value)
        );
        return mergeColumnAndRow.filter((value) =>
            boxPossibilities.includes(value)
        );
    }

    /**
     * Get if there is only one possibility for a cell & its index. -1 if there are none.
     * @param puzzleString{string}
     * @returns{number}
     */
    isThereCellWithOnePossibility(puzzleString) {
        for (var i = 0; i < 81; i++) {
            if (this.getPossibilitiesForCell(i, puzzleString).length == 1) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Update the puzzle string with an input
     * @param number{string} The number to enter
     * @param index{number} The index to change
     * @param puzzleString{string}
     * @returns{string}
     */
    setNumberInInput(number, index, puzzleString) {
        let ret = '';
        if (index > 0) {
            ret += puzzleString.substring(0, index);
        }
        ret += number;
        if (index < 80) {
            ret += puzzleString.substring(index + 1);
        }
        return ret;
    }

    /**
     * Fill in the cells with only one possibility
     * @param puzzleString{string}
     * @returns{string}
     */
    sortOnePossibilitiesInCell(puzzleString) {
        let ret = puzzleString;
        let indexOfCellWithOnePossibility =
            this.isThereCellWithOnePossibility(ret);
        while (indexOfCellWithOnePossibility > -1) {
            let num = this.getPossibilitiesForCell(
                indexOfCellWithOnePossibility,
                ret
            );
            ret = this.setNumberInInput(
                num[0],
                indexOfCellWithOnePossibility,
                ret
            );
            indexOfCellWithOnePossibility =
                this.isThereCellWithOnePossibility(ret);
            //console.log('new puzzle', ret);
        }
        return ret;
    }

    /**
     * See if the sudoku is valid
     */
    isPuzzleValid(puzzleString) {
        if (puzzleString.length !== 81) {
            return false;
        }
        for (let i = 0; i < 9; i++) {
            //Check each row to make sure that there are no duplicate values
            let row = [];
            for (let j = 1; j < 10; j++) {
                let id = i * 9 + j - 1;
                let cellVal = puzzleString[id];
                if (this.isInputValid(cellVal)) {
                    //console.log("row", row, 'cellVal', cellVal, 'i',i, 'id',id);
                    if (row.includes(cellVal)) {
                        //console.log("row", row, 'cellVal', cellVal);
                        return false;
                    } else {
                        row.push(cellVal);
                    }
                }
            }
        }

        //Check each column
        for (let i = 0; i < 9; i++) {
            let column = [];
            for (let j = 0; j < 9; j++) {
                let id = j * 9 + i;
                let cellVal = puzzleString[id];
                if (this.isInputValid(cellVal)) {
                    //console.log("column", column, 'cellVal', cellVal, 'i',i, 'id',id);
                    if (column.includes(cellVal)) {
                        return false;
                    } else {
                        column.push(cellVal);
                    }
                }
            }
        }

        //check each box
        let boxStarts = [0, 3, 6, 27, 30, 33, 54, 57, 60];
        let offset = [0, 1, 2, 9, 10, 11, 18, 19, 20];
        for (let i = 0; i < 9; i++) {
            let box = [];
            for (let j = 0; j < 9; j++) {
                let id = boxStarts[i] + offset[j];
                let cellVal = puzzleString[id];
                if (this.isInputValid(cellVal)) {
                    //console.log("box", box, 'cellVal', cellVal, 'i',i, 'id',id);
                    if (box.includes(cellVal)) {
                        return false;
                    } else {
                        box.push(cellVal);
                    }
                }
            }
        }
        return true;
    }

    /**
     * Get the next free cell
     * @param input{string} The sudoku puzzle
     * @returns{number}
     */
    getNextUnsolvedCell(input) {
        for (var i = 0; i < 81; i++) {
            if (!this.isInputValid(input[i])) {
                return i;
            }
        }
        return -1;
    }

    /**
     * This is to recursively solve it
     * It needs to run through guessing the next number
     * @param input{string}
     * @returns{string|bool}
     */
    recursiveSolve(puzzleString) {
        let nextUnsolvedCell = this.getNextUnsolvedCell(puzzleString);
        if (nextUnsolvedCell == -1) {
            return puzzleString;
        }

        const cellPossibilities = this.getPossibilitiesForCell(
            nextUnsolvedCell,
            puzzleString
        );
        for (let i = 0; i < cellPossibilities.length; i++) {
            puzzleString = this.setNumberInInput(
                cellPossibilities[i],
                nextUnsolvedCell,
                puzzleString
            );
            if (this.isPuzzleValid(puzzleString)) {
                let newPuzzle = this.recursiveSolve(puzzleString);
                if (newPuzzle) {
                    return newPuzzle;
                }
            }
        }
        return false;
    }

    /**
   * This is to try to solve the sudoku puzzle
   * @param puzzleString{string} The sudoku puzzle with blanks as .
   * @returns{{
    error: string;
    solution?: undefined;
} | {
    solution: any;
    error?: undefined;
}}
   */
    solve(puzzleString) {
        if (!this.isPuzzleValid(puzzleString)) {
            return { error: 'Puzzle cannot be solved' };
        }

        let newSolution = this.sortOnePossibilitiesInCell(puzzleString);
        if (this.getNextUnsolvedCell(newSolution) == -1) {
            return { solution: newSolution };
        }

        // otherwise we need to start solving it recursively
        newSolution = this.recursiveSolve(newSolution);
        if (newSolution) {
            return { solution: newSolution };
        }

        return { error: 'Puzzle cannot be solved' };
    }
}

export default SudokuSolver;
