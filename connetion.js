const mysql = require("mysql2/promise");

async function databaseAction(command, values){
        const connection = await createConnection();
        try {
            const [results] = await connection.execute(command, values);
            return results;
        } catch (error) {
            // console.log(error);
            throw error;
        } finally {
            console.log("CONNECTION CLOSED");
            connection.end();
        }

    }
async function createConnection(){
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "db_feedback",
    })
}

module.exports = {
    databaseAction
};