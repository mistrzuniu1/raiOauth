require('./db/connection');
const express = require('express');
const userRouter = require('./user');
const cors = require('cors');
const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.listen(3000, 'localhost', () => {
    console.log('Server started.')
});
