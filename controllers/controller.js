const connectDB = require("../dbConnect")
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken")


const getAllContacts = async (req, res) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.jwtSecurityKey);
    const userId = await decodedToken.id;
    const db = await connectDB();
    const collection = db.collection("contacts");
    const result = await collection.find({ createdBy: decodedToken.id }).toArray();
    res.json(result)
  }
  catch (error) {
    res.json({ result: "no datas found" })
  }
}

const getSingleContact = async (req, res) => {

  try {
    const db = await connectDB();
    const collection = db.collection("contacts");

    const contact = await collection.findOne({ _id: new ObjectId(req.params) })
    if (!contact) {
      return res.json({ contact: "no contact found" })
    }

    res.status(200).json({ contact })
  }

  catch (err) {
    console.log(err);
  }


}

const createContact = async (req, res) => {

  const { contactName, phoneNumber, emailID } = req.body

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.jwtSecurityKey);
  const userId = await decodedToken.id;
  console.log(decodedToken);

  const db = await connectDB();
  const collection = db.collection("contacts");
  const existingUser = await collection.findOne({ 
    phoneNumber: phoneNumber, 
    emailID: emailID, 
    createdBy: decodedToken.id 
  })

  if (!existingUser) {
    try {
      const phoneRegExp = /^\d+$/;
      if (phoneNumber && !phoneRegExp.test(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }

      const result = await collection.insertOne({ ...req.body, createdAt: Date.now(), createdBy: decodedToken.id });
      res.json(result);
    }
    catch (error) {
      res.json({ result: "unable to add contact" })
    }
  }

  else {
    res.json({ result: "contact already exists", userId })
  }



}


const updateContact = async (req, res) => {

  const { contactName, phoneNumber, emailID } = req.body

  try {
    const db = await connectDB();
    const collection = db.collection("contacts");

    const contact = await collection.findOneAndUpdate({ _id: new ObjectId(req.params) },
      {
        $set: {
          contactName: contactName,
          phoneNumber: phoneNumber,
          emailID: emailID
        }
      })
    if (!contact) {
      return res.json({ contact: "no contact found" })
    }
    res.json({ result: contact })
  }
  catch (error) {
    console.log(error);
  }
}


const deleteContact = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("contacts");

    const contact = await collection.findOneAndDelete({ _id: new ObjectId(req.params) })
    if (!contact) {
      return res.json({ contact: "no contact found" })
    }
    res.json({ result: contact })
  }
  catch (error) {
    console.log(error);
  }
}

module.exports = { getAllContacts, getSingleContact, createContact, deleteContact, updateContact }