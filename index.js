const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
const todoRouter = require('./routes/todoRouter');

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('tiny'));

app.use('/todos', todoRouter);

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).send({ message: err.message || 'Internal server error' });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
