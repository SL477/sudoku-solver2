class SudokuSolver {
  isInputValid(input) {
    //Myfunction
    const zeroToNine = ['1','2','3','4','5','6','7','8','9'];
    return zeroToNine.includes(input);
  }

  validate(puzzleString) {
    const validChars = ['1','2','3','4','5','6','7','8','9', '.'];
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    for (var i = 0; i < 81; i++) {
      if (!validChars.includes(puzzleString[i])) {
        return { error: 'Invalid characters in puzzle' };
      }
    }
    return true;
  }

  getBoxNumber(index) {
    let boxNums = [0,0,0,1,1,1,2,2,2,0,0,0,1,1,1,2,2,2,0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,3,3,3,4,4,4,5,5,5,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,6,6,6,7,7,7,8,8,8,6,6,6,7,7,7,8,8,8];
    return boxNums[index];
  }

  getRowNumber(row) {
    let rows = ['A','B','C','D','E','F','G','H','I'];
    let rowIndex = rows.findIndex((r) => {return r === row});
    return rowIndex;
  }

  getColumnNumber(col) {
    let cols = ['1','2','3','4','5','6','7','8','9'];
    let colIndex = cols.findIndex((r) => {return r === col});
    return colIndex;
  }

  getRowColumn(value) {
    //Value in form of A1-I9
    if (!value) {
      return {error: 'Invalid coordinate'};
    }
    if (value.length !== 2) {
      return {error: 'Invalid coordinate'};
    }
    let ret = {row: null, column: null};
    let rowIndex = this.getRowNumber(value[0]);
    if (rowIndex < 0) {
      return {error: 'Invalid coordinate'};
    }
    ret.row = rowIndex;

    let colIndex = this.getColumnNumber(value[1]);
    if (colIndex < 0) {
      return {error: 'Invalid coordinate'};
    }

    ret.column = colIndex;

    return ret;
  }

  getPossibilitiesForRow(row, puzzle) {
    let ret = ['1','2','3','4','5','6','7','8','9'];
    for (var i = 0; i < 9; i++) {
      let number = puzzle[i + (9 * row)];
      if (this.isInputValid(number)) {
        let index = ret.indexOf(number);
        ret.splice(index,1);
      }
    }
    return ret;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    //Returns true/false
    let possRow = this.getPossibilitiesForRow(row, puzzleString);
    return possRow.includes(String(value));
  }

  getPossibilitiesForColumn(col, puzzle) {
    let ret = ['1','2','3','4','5','6','7','8','9'];
    for (var i = 0; i < 9; i++) {
      let number = puzzle[col + (9 * i)];
      //console.log('number',number)
      if (this.isInputValid(number)) {
        let index = ret.indexOf(number);
        //console.log('index', index);
        ret.splice(index,1);
      }
    }
    return ret;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let possCol = this.getPossibilitiesForColumn(column, puzzleString);
    return possCol.includes(String(value));
  }

  getPossibilitiesForBox(num, input) {
    let boxStarts = [0,3,6,27,30,33,54,57,60];
    let offset = [0,1,2,9,10,11,18,19,20];
    let ret = ['1','2','3','4','5','6','7','8','9'];
    for (var i = 0; i < 9; i++) {
      let number = input[boxStarts[num] + offset[i]];
      //console.log('number',number)
      if (this.isInputValid(number)) {
        let index = ret.indexOf(number);
        //console.log('index', index);
        ret.splice(index,1);
      }
    }
    return ret;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let index = (row * 9) + column;
    let boxNum = this.getBoxNumber(index);
    let possBox = this.getPossibilitiesForBox(boxNum, puzzleString);
    return possBox.includes(String(value));
  }

  getPossibilitiesForCell(index, input) {
    if (this.isInputValid(input[index])) {
      return [];
    }
    let columnPoss = this.getPossibilitiesForColumn(index % 9, input);
    let rowPoss = this.getPossibilitiesForRow(Math.floor(index / 9), input);
    let boxPoss = this.getPossibilitiesForBox(this.getBoxNumber(index), input);
  
    let arr = [columnPoss, rowPoss, boxPoss];
    return arr.reduce((p,c) => p.filter(e => c.includes(e)));
  }

  isThereCellWithOnePossibility(input) {
    for (var i = 0; i < 81; i++) {
      if (this.getPossibilitiesForCell(i, input).length == 1) {
        return i;
      }
    }
    return -1;
  }

  setNumberInInput(number, index, input) {
    let ret = '';
    if (index > 0) {
      ret += input.substring(0, index);
    }
    ret += number;
    if (index < 80) {
      ret += input.substring(index + 1);
    }
    return ret;
  }

  sortOnePossibilitiesInCell(input) {
    let ret = input;
    let indexOfCellWithOnePossibility = this.isThereCellWithOnePossibility(ret);
    while (indexOfCellWithOnePossibility > -1) {
      let num = this.getPossibilitiesForCell(indexOfCellWithOnePossibility, ret);
      ret = this.setNumberInInput(num[0], indexOfCellWithOnePossibility, ret);
      indexOfCellWithOnePossibility = this.isThereCellWithOnePossibility(ret);
      console.log('new puzzle', ret);
    }
    return ret;
  }

  isPuzzleValid(input) {
    if (input.length !== 81) {
      return false;
    }
    for (var i = 0; i < 9; i++) {
      //Check each row to make sure that there are no duplicate values
      let row = [];
      for (var j = 1; j < 10; j++) {
        let id = ((i * 9) + j) - 1;
        let cellVal = input[id];
        if (this.isInputValid(cellVal)) {
          //console.log("row", row, 'cellVal', cellVal, 'i',i, 'id',id);
          if (row.includes(cellVal)) {
            //console.log("row", row, 'cellVal', cellVal);
            return false;
          }
          else {
            row.push(cellVal);
          }
        }
      }
    }
  
    //Check each column
    for (var i = 0; i < 9; i++) {
      let column = [];
      for (var j = 0; j < 9; j++) {
        let id = (j * 9) + i;
        let cellVal = input[id];
        if (this.isInputValid(cellVal)) {
          //console.log("column", column, 'cellVal', cellVal, 'i',i, 'id',id);
          if (column.includes(cellVal)) {
            return false;
          }
          else {
            column.push(cellVal);
          }
        }
      }
    }
  
    //check each box
    let boxStarts = [0,3,6,27,30,33,54,57,60];
    let offset = [0,1,2,9,10,11,18,19,20];
    for (var i = 0; i < 9; i++) {
      let box = [];
      for (var j = 0; j < 9; j++) {
        let id = boxStarts[i] + offset[j];
        let cellVal = input[id];
        if (this.isInputValid(cellVal)) {
          //console.log("box", box, 'cellVal', cellVal, 'i',i, 'id',id);
          if (box.includes(cellVal)) {
            return false;
          }
          else {
            box.push(cellVal);
          }
        }
      }
    }
    return true;
  }

  getNextUnsolvedCell(input) {
    for (var i = 0; i < 81; i++) {
      if (!this.isInputValid(input[i])) {
        return i;
      }
    }
    return -1;
  }

  solve(puzzleString) {
    if (!this.isPuzzleValid(puzzleString)) {
      return { error: 'Puzzle cannot be solved' };
    }

    let newSolution = puzzleString;
    newSolution = this.sortOnePossibilitiesInCell(newSolution);
    if (this.getNextUnsolvedCell(newSolution) == -1) {
      return { solution: newSolution};
    }
    return { error: 'Puzzle cannot be solved' };
  }
}

module.exports = SudokuSolver;

