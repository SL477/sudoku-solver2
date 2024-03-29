/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

import { assert as _assert } from 'chai';
const assert = _assert;
import Solver from '../controllers/sudoku-solver.js';
let solver;
import { suite, test, suiteSetup } from 'mocha';

suite('UnitTests', () => {
    suiteSetup((done) => {
        solver = new Solver();
        done();
    });

    suite('Function validate()', () => {
        test('Valid Characters, length of 81', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            assert.isTrue(solver.validate(input), 'Validate Should be true');
            done();
        });

        // Invalid characters or numbers are not accepted
        // as valid input for the puzzle grid
        test('Invalid characters (anything other than "1-9" or "."") are not accepted', (done) => {
            const input =
                '..X..5.1.85.4....2432.HI...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const error = 'Invalid characters in puzzle';
            assert.equal(
                solver.validate(input).error,
                error,
                'Should return an error'
            );
            done();
        });

        // Puzzles that are not 81 numbers/periods long show the message
        test('Shows an error for puzzles that are not 81 numbers long', (done) => {
            const shortStr = '83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const longStr =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...';
            const errorMsg = 'Expected puzzle to be 81 characters long';

            assert.equal(
                solver.validate(longStr).error,
                errorMsg,
                'Should return an error'
            );
            assert.equal(
                solver.validate(shortStr).error,
                errorMsg,
                'Should return an error'
            );
            done();
        });
    });

    suite('Function checkRowPlacement()', () => {
        test('Valid placement for a row', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 0;
            const col = 0;
            const value = 3;

            assert.isTrue(
                solver.checkRowPlacement(input, row, col, value),
                '3 should be allowed ' +
                    solver.checkRowPlacement(input, row, col, value)
            );

            done();
        });

        test('Invalid placement for a row', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 0;
            const col = 0;
            const value = 9;

            assert.isFalse(
                solver.checkRowPlacement(input, row, col, value),
                '9 should not be allowed ' +
                    solver.checkRowPlacement(input, row, col, value)
            );

            done();
        });
    });

    suite('Function checkColPlacement()', () => {
        test('Valid placement for a column', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 0;
            const col = 0;
            const value = 3;

            assert.isTrue(
                solver.checkColPlacement(input, row, col, value),
                '3 should be allowed'
            );
            done();
        });

        test('Invalid placement for a column', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 0;
            const col = 0;
            const value = 8;

            assert.isFalse(
                solver.checkColPlacement(input, row, col, value),
                '9 should not be allowed'
            );
            done();
        });
    });

    suite('Function checkRegionPlacement()', () => {
        test('Valid placement for a region', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 4;
            const col = 4;
            const value = 3;

            assert.isTrue(
                solver.checkRegionPlacement(input, row, col, value),
                '3 should be allowed in box'
            );

            done();
        });

        test('Invalid placement for a region', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const row = 4;
            const col = 4;
            const value = 7;

            assert.isFalse(
                solver.checkRegionPlacement(input, row, col, value),
                '7 should not be allowed in box'
            );

            done();
        });
    });

    suite('Function solvePuzzle()', () => {
        // Valid complete puzzles pass
        test('Valid puzzles pass', (done) => {
            const input =
                '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

            assert.equal(
                solver.solve(input).solution,
                input,
                'Should be identical'
            );
            done();
        });

        // Invalid complete puzzles fail
        test('Invalid puzzles fail', (done) => {
            const input =
                '779235418851496372432178956174569283395842761628713549283657194516924837947381625';

            assert.equal(
                solver.solve(input).error,
                'Puzzle cannot be solved',
                'Should be unsolvable'
            );
            done();
        });

        // Returns the expected solution for a valid, incomplete puzzle
        test('Returns the expected solution for an incomplete puzzle', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const solution =
                '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

            assert.equal(
                solver.solve(input).solution,
                solution,
                'Should solve puzzle'
            );
            done();
        });
    });
});
