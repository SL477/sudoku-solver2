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
  
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //puzzle 81 character puzzle
      //coordinate e.g. A9
      //value 1-9

      //returns {valid: true/false if number can be placed there
      //if valid is false then 
      //conflict: ['row','column','region'] depending on which stops it from being valid}

      
      

      //if it is missing puzzle, coordinate or value, then return { error: Required field(s) missing }
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
        res.json({ error: 'Required field(s) missing' });
      }
      else {
        //if the puzzle has invalid characters then it returns { error: 'Invalid characters in puzzle' }
        //if the puzzle is invalid length then returns { error&#58; 'Expected puzzle to be 81 characters long' }
        const isValid = solver.validate(req.body.puzzle);
        if (isValid['error']){
          res.json(isValid);
        }
        else {
          //if the value submitted is not between 1-9 then return { error: 'Invalid value' }
          if (!solver.isInputValid(req.body.value)) {
            res.json({ error: 'Invalid value' });
          }
          else {
            //if the coordinate doesn't exist then return { error: 'Invalid coordinate'}
            const rowCol = solver.getRowColumn(req.body.coordinate);
            if (rowCol.error) {
              res.json({ error: 'Invalid coordinate' });
            }
            else {
              //res.json({ error: solver.getPossibilitiesForColumn(0,'..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')});
              //Get whether it is allowed in col, row, region
              const isCol = solver.checkColPlacement(req.body.puzzle,rowCol.row, rowCol.column, req.body.value);
              const isRow = solver.checkRowPlacement(req.body.puzzle,rowCol.row, rowCol.column, req.body.value);
              const isBox = solver.checkRegionPlacement(req.body.puzzle,rowCol.row, rowCol.column, req.body.value);
              if (isBox && isCol && isRow) {
                res.json({valid: true});
              }
              else {
                const conflicts = [];
                if (!isRow) {
                  conflicts.push('row');
                }
                if (!isCol) {
                  conflicts.push('column');
                }
                if (!isBox) {
                  conflicts.push('region');
                }
                res.json({valid: false, conflict: conflicts});
              }
            }
          }
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      //If missing puzzle
      if (!req.body.puzzle) {
        res.json({error: 'Required field missing'});
      }
      else {
        //Check if it is valid
        const isValid = solver.validate(req.body.puzzle);
        if (isValid.error) {
          //let err = isValid.error;
          //console.log('error', err);
          res.json({error: isValid.error});
        }
        else {
          res.json(solver.solve(req.body.puzzle));
        }
      }
    });
};
