// create register , login and jwt tokens

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const connectDB = require('../dbConnect')

// signUp 

const signUp = async (req, res) => {

  try {


    const { username, email, password } = await req.body;


    // input Validation
    if (!(username && password && email)) {
      return res.status(400).send("All input is required");
    }

    // check if the user is already registered or not
    const db = await connectDB();

    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      return res.json({ log: "User Already Exists" });
    }

    // hashed password
    const hashPassword = await bcrypt.hash(password, 10);

    // if accepts all logic add to database
    const newUser = { username: username, password: hashPassword, email: email };
    const result = await db.collection("users").insertOne(newUser);

    // create token
    const token = jwt.sign(
      { id: result.insertedId, username: newUser.username },
      process.env.jwtSecurityKey,
      {
        expiresIn: process.env.expiry,
      }
    );
    // save token in the database
    await db.collection("users").updateOne(
      { _id: result.insertedId },
      { $set: { token: token } }
    );

    res.json({ status: "success", username, token })



  } catch (error) {
    res.status(500).json(error);
  }

}

const loginID = ''

// logIn

const logIn = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    const db = await connectDB();
    const user = await db.collection("users").findOne({ email: email });


    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.jwtSecurityKey,
        {
          expiresIn: process.env.expiry,
        }
      );
  
      // Update user with token
      const database = db.collection("users");
      database.updateOne(
        { _id: user._id },
        { $set: { token: token } }
      );

      
      // Send response with status
      res.json({ status: user });

      

    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).send(error.message);
  }


}


module.exports = { signUp, logIn  }