/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

import { use, assert } from 'chai';
import chaiHttp from 'chai-http';
const chaiServer = use(chaiHttp);
// const assert = chai.assert;
import server from '../server.js';
import { suite, test } from 'mocha';

suite('Functional Tests', () => {
    suite('POST to /api/solve', () => {
        test('Solvable puzzle posted returns completed puzzle', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const output =
                '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

            chaiServer.request
                .execute(server)
                .post('/api/solve')
                .send({
                    puzzle: input,
                })
                .end((err, res) => {
                    assert.equal(res.body.solution, output, 'It should solve');
                    done();
                });
        });

        test('Puzzle Field Missing', (done) => {
            const error = { error: 'Required field missing' };
            chaiServer.request
                .execute(server)
                .post('/api/solve')
                .send({
                    test: 'blank',
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.error,
                        error.error,
                        'Required field missing'
                    );
                    done();
                });
        });

        test('Invalid Characters in Puzzle', (done) => {
            const error = { error: 'Invalid characters in puzzle' };

            chaiServer.request
                .execute(server)
                .post('/api/solve')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a',
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.error,
                        error.error,
                        'Invalid characters in puzzle "' + res.body.error + '"'
                    );
                    done();
                });
        });

        test('Puzzle incorrect length', (done) => {
            const error = { error: 'Expected puzzle to be 81 characters long' };

            chaiServer.request
                .execute(server)
                .post('/api/solve')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..9',
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.error,
                        error.error,
                        'Puzzle too long "' + res.body.error + '"'
                    );
                    done();
                });
        });

        test('Puzzle Cannot be Solved', (done) => {
            const input =
                '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
            const error = { error: 'Puzzle cannot be solved' };

            chaiServer.request
                .execute(server)
                .post('/api/solve')
                .send({
                    puzzle: input,
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.error,
                        error.error,
                        'Cannot solve invalid puzzle "' + res.body.error + '"'
                    );
                    done();
                });
        });
    });

    suite('POST to /api/check', () => {
        test('All fields filled in correctly, valid placement', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const coordinate = 'A1';
            const value = '7';
            // const status = {valid: true};

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value,
                })
                .end((err, res) => {
                    assert.isTrue(res.body.valid, '7 should be allowed');
                    done();
                });
        });

        test('All fields filled in correctly, invalid placement, single conflict', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const coordinate = 'A2';
            const value = '1';
            const status = { valid: false, conflict: ['row'] };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value,
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.conflict[0],
                        status.conflict[0],
                        '1 should not be allowed'
                    );
                    done();
                });
        });

        test('All fields filled in correctly, invalid placement, multiple conflicts', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const coordinate = 'A1';
            const value = '1';
            const status = { valid: false, conflict: ['row', 'column'] };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value,
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.conflict[0],
                        status.conflict[0],
                        '1 should not be allowed'
                    );
                    done();
                });
        });

        test('All fields filled in correctly, invalid placement, all conflicts', (done) => {
            const input =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const coordinate = 'A1';
            const value = '5';
            const status = {
                valid: false,
                conflict: ['row', 'column', 'region'],
            };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value,
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.conflict.length,
                        status.conflict.length,
                        '5 should not be allowed'
                    );
                    done();
                });
        });

        test('Required Field(s) Missing', (done) => {
            const error = { error: 'Required field(s) missing' };
            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({ test: 'blank' })
                .end((err, res) => {
                    assert.equal(
                        res.body.error,
                        error.error,
                        'Should return required fields missing'
                    );
                    done();
                });
        });

        test('Invalid Characters in Puzzle', (done) => {
            const error = { error: 'Invalid characters in puzzle' };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a',
                    coordinate: 'A1',
                    value: 1,
                })
                .end((err, res) => {
                    assert.equal(res.body.error, error.error, 'Invalid chars');
                    done();
                });
        });

        test('Puzzle incorrect length', (done) => {
            const error = { error: 'Expected puzzle to be 81 characters long' };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..4',
                    coordinate: 'A1',
                    value: 1,
                })
                .end((err, res) => {
                    assert.equal(res.body.error, error.error, 'Puzzle length');
                    done();
                });
        });

        test('Coordinate Out of Bounds', (done) => {
            const coordinate1 = 'K1';
            // const coordinate2 = "A11";
            const puzzle =
                '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
            const error = { error: 'Invalid coordinate' };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: puzzle,
                    coordinate: coordinate1,
                    value: '2',
                })
                .end((err, res) => {
                    assert.equal(
                        res.body.error,
                        error.error,
                        'Invalid coordinate'
                    );
                    done();
                });
        });

        test('Invalid Value', (done) => {
            const error = { error: 'Invalid value' };

            chaiServer.request
                .execute(server)
                .post('/api/check')
                .send({
                    puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                    coordinate: 'A1',
                    value: 'a',
                })
                .end((err, res) => {
                    assert.equal(res.body.error, error.error, 'Invalid value');
                    done();
                });
        });
    });
});
