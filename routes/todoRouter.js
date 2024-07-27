const express = require('express');
const todoRouter = express.Router();
const db = require('../service/db');
const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    status: Joi.string().required()
});

todoRouter.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM todos', []);
         // console.log(results);
        if (!results.length) {
            return res.status(404).send('Todos list is empty');
        }
        //  res.send(results);
        res.status(200).send(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

todoRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
        if (!results.length) {
            return res.status(404).send({ message: `Todo with id ${id} not found` });
        }
        res.status(200).send(results[0]);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

todoRouter.post('/', async (req, res, next) => {
    try {
         // console.log(req.body);
        
        //  const { title, status} = req.body;
         // const error = new Error();
         // try {
         //     const  error  = await schema.validate({ title, status });
         // } catch (error) {
 
         // }
 
        const { title, status } = req.body;
        const { error } = schema.validate({ title, status });

        if (error) {
            console.error('Validation error:', error.details);
            // 
            return res.status(400).send({ message: error.details[0].message });
        }

        const repeatedTodo = await db.query('SELECT * FROM todos WHERE title = ?', [title]);
        // console.log(repeatedTodo);
        if (repeatedTodo.length > 0) {
            return res.status(409).send({ message: 'Todo already exists' });
        }

        const result = await db.query('INSERT INTO todos (title, status) VALUES (?, ?)', [title, status]);
        // console.log(result);
        if (!result.affectedRows) {
            return res.status(500).send({ message: 'Server error' });
        }
        // if(!result?.affectedRows){
        //     error.status = 501;
        //     error.message = 'server error';
        //     throw error;
        // } 
        res.status(201).send({ success: true });
    } catch (error) {
        console.error('Error in POST /todos:', error);
        next(error);
    }
});

todoRouter.patch('/:id', async (req, res, next) => {
    try {
           // console.log(req.body);  
        const { id } = req.params;
        const { title, status } = req.body;
        const { error } = schema.validate({ title, status });

        if (error) {
            console.error('Validation error:', error.details);
            return res.status(400).send({ message: error.details[0].message });
        }

        const todofound = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
        if (!todofound.length) {
            return res.status(404).send({ message: `Todo with id ${id} not found` });
        }
        //error.status casues errors wtih validation

        // if(!todofound){
        //     error.status=404;
        //     error.message=`no todo with ${todoId}  id is found`;
        //     throw error;
        // }

        const result = await db.query('UPDATE todos SET title = ?, status = ? WHERE id = ?', [title, status, id]);
        if (!result.affectedRows) {
            return res.status(500).send({ message: 'Server error' });
        }
        res.status(200).send({ success: `Todo with id ${id} updated successfully` });
    } catch (error) {
        console.error('Error in PATCH /todos:', error);
        next(error);
    }
});

todoRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const todofound = await db.query('SELECT * FROM todos WHERE id = ?', [id]);

        if (!todofound.length) {
            return res.status(404).send({ message: `Todo with id ${id} not found` });
        }

        const result = await db.query('DELETE FROM todos WHERE id = ?', [id]);
        if (!result.affectedRows) {
            return res.status(500).send({ message: 'Server error' });
        }
        res.status(200).send({ success: `Todo with id ${id} deleted successfully` });
    } catch (error) {
        console.error('Error in DELETE /todos:', error);
        next(error);
    }
});

module.exports = todoRouter;
