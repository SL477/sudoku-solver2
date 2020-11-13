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

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

