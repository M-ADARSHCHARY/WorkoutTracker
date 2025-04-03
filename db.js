import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Connection between backend and sql database
var connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER, // mySql Username
    password : process.env.DB_PASSWORD, // mysql password
    database : process.env.DB_NAME, //  name of the database using
  });

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database");
});

export default connection;
