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

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

