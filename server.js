require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');

const app = express();
app.use(cors()); //allows the angular app to use API to communicate
app.use(express.json()); 

//connecting to MongoDB using the MongoDB_URI

mongoose.connect(process.env.MONGODB_URI);

const Student = mongoose.model
('Student', new mongoose.Schema(
{
    name: String,
    section: String
}))//Attributes

//API Endpoints for the application
app.post('/api/student', async (req, res) =>{
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
    console.log("Added new student: ", student);
});

app.get('/api/student', async(req, res) => {
    const list = await Student.find();
    res.send(list);
    console.log("Fetched all student");
});

app.listen(3000, () => console.log('API is running on port 3000'));

