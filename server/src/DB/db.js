import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Connection between backend and sql database
var connection = await mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER, // mySql Username
    password : process.env.DB_PASSWORD, // mysql password
    database : process.env.DB_NAME, //  name of the database using
  });

export default connection;
