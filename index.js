const express = require('express')
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

const app = express();
const url ='mongodb+srv://maniya:Mani1123@cluster0.uszff0w.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url);

app.use(express.json())


// Check server work or not
app.get("/",(req,res) => {
    res.json({message:"working"})
})

// Create mentor
app.post("/createMentor",async(req,res)=>{
     // db connection
  try {
    const connection = await client.connect();
    const db = connection.db("mongodb_sample_project");
    const product = await db.collection("mentor").insertOne(req.body);
    await connection.close();
    res.json({ message: "Mentor created", id: product.insertedId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// Create student
app.post("/createStudent",async(req,res)=>{
    // db connection
 try {
   const connection = await client.connect();
   const db = connection.db("mongodb_sample_project");
   const product = await db.collection("Students").insertOne(req.body);
   await connection.close();
   res.json({ message: "student created", id: product.insertedId });
 } catch (error) {
   console.log(error);
   res.status(500).json({ message: "something went wrong" });
 }
});


// Assign student to particular mentor
app.put("/assignStudent/:mentorId",async(req,res)=>{
    // db connection
    try {
        const connection = await client.connect();
        const db = connection.db("mongodb_sample_project");
        const mentorData = await db
          .collection("mentor")
          .findOne({ _id: mongodb.ObjectId(req.params.mentorId) });
        if (mentorData) {
          delete req.body._id;
          const Mentor = await db
            .collection("mentor")
            .updateOne(
              { _id: mongodb.ObjectId(req.params.mentorId) },
              { $set: req.body }
            );
          await connection.close();
          res.json({ message: "assigned successfully", Mentor });
        } else {
          res.status(404).json({ message: "Mentor not found" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
      }
    
});

// Assign mentor to student
app.put("/assignMentor/:studentId",async(req,res)=>{
  // db connection
  try {
      const connection = await client.connect();
      const db = connection.db("mongodb_sample_project");
      const mentorData = await db
        .collection("Students")
        .findOne({ _id: mongodb.ObjectId(req.params.studentId) });
      if (mentorData) {
        delete req.body._id;
        const Student = await db
          .collection("Students")
          .updateOne(
            { _id: mongodb.ObjectId(req.params.studentId) },
            { $set: req.body }
          );
        await connection.close();
        res.json({ message: "assigned successfully", Student });
      } else {
        res.status(404).json({ message: "student not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  
});


app.get("/mentor/:mentorId", async (req, res) => {
  try {
    const connection = await client.connect();
    const db = connection.db("mongodb_sample_project");
    const mentor = await db
      .collection("mentor")
      .findOne(
        { _id: mongodb.ObjectId(req.params.mentorId) },
        { $set: req.body }
      );
    await connection.close();
    res.json(mentor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
})

app.listen(process.env.PORT || 3003, function () {
  console.log("Server Listening!");
});