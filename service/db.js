const mysql = require('mysql2/promise');
const config = require('../config');

const query = async (sql, params) =>{
    try {
        const connection = await mysql.createConnection(config.db);
        // console.log("why connection :"+connection);
        console.log('connection successed');
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        // console.log(error);
        console.log('connection failed ');
    }
}

exports.query = query;