const { MongoClient } = require("mongodb")
const dotenv = require('dotenv')
dotenv.config()

const connectionString = process.env.dbURL

const client = new MongoClient(connectionString);

let connectDB  =async () =>{
  try {
    await client.connect();
    let db = client.db("contacts")
    return db
  } catch(e) {
    console.error(e);
  }
}


module.exports = connectDB