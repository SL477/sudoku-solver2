import { config } from 'dotenv';
config();
import express from 'express';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import cors from 'cors';
import fccTestingRoutes from './routes/fcctesting.js';
import apiRoutes from './routes/api.js';
import runner from './test-runner.js';

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(json());
app.use(urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);

// 404 Not Found Middleware
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
    res.status(404).type('text').send('Not Found');
});

//Start our server and tests!
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
    // process.env.NODE_ENV='test'
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
            } catch (error) {
                console.log('Tests are not valid:');
                console.error(error);
            }
        }, 1500);
    }
});

export default app; // for testing
