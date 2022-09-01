const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const PORT = 8080;
const enviroment = 'dev';

const app = express();

// middleware setup
app.use(morgan(enviroment));
app.use(bodyParser.json());
app.use(express.static("./views"));
app.use(express.static("./scripts"));


app.get('/', (req, res) => {
	res.sendFile("views/index.html");
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));