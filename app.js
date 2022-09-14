const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = 8080;
const enviroment = 'dev';

const app = express();

// middleware setup
app.use(morgan(enviroment));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/front_page.html');
})

app.get('/game', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));