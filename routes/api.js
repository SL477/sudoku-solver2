/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //puzzle 81 character puzzle
      //coordinate e.g. A9
      //value 1-9

      //returns {valid: true/false if number can be placed there
      //if valid is false then 
      //conflict: ['row','column','region'] depending on which stops it from being valid}

      //if the puzzle has invalid characters then it returns { error: 'Invalid characters in puzzle' }

      //if the puzzle is invalid length then returns { error&#58; 'Expected puzzle to be 81 characters long' }

      

      //if the coordinate doesn't exist then return { error: 'Invalid coordinate'}

      //if the value submitted is not between 1-9 then return { error: 'Invalid value' }

      //if it is missing puzzle, coordinate or value, then return { error: Required field(s) missing }
      if (!req.post.puzzle || !req.post.coordinate || !req.post.value) {
        res.json({ error: 'Required field(s) missing!' });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

    });
};
