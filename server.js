require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendanceDB')
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('MongoDB database connection error:', err));

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true },
  monday: { type: String, default: '' },
  tuesday: { type: String, default: '' },
  wednesday: { type: String, default: '' },
  thursday: { type: String, default: '' },
  friday: { type: String, default: '' }
});
const Student = mongoose.model('Student', StudentSchema);

const InstructorSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  instructorId: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });
const Instructor = mongoose.model('Instructor', InstructorSchema);

// INSTRUCTOR AUTHENTICATION ENDPOINTS

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, instructorId, email, password } = req.body;

    if (!fullName || !instructorId || !email || !password) {
      return res.status(400).json({ message: 'All registration parameters are required.' });
    }

    const existingEmail = await Instructor.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email address is already registered.' });
    }

    const existingId = await Instructor.findOne({ instructorId });
    if (existingId) {
      return res.status(400).json({ message: 'This Instructor ID number is already in use.' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newInstructor = new Instructor({
      fullName,
      instructorId,
      email,
      password: hashedPassword
    });

    const savedInstructor = await newInstructor.save();
    console.log("Registered new instructor: ", savedInstructor.email);

    res.status(201).json({
      message: 'Instructor account registered successfully!',
      instructor: {
        id: savedInstructor._id,
        fullName: savedInstructor.fullName,
        instructorId: savedInstructor.instructorId,
        email: savedInstructor.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server registration error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    if (inputHash !== instructor.password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log("Logged in instructor: ", instructor.email);
    res.status(200).json({
      message: 'Logged in successfully!',
      instructor: {
        id: instructor._id,
        fullName: instructor.fullName,
        email: instructor.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server login error.' });
  }
});


// 5. STUDENT ATTENDANCE ENDPOINTS

app.post('/api/student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
    console.log("Added new student: ", student.name);
  } catch (error) {
    res.status(500).send({ message: "Error saving student." });
  }
});

app.get('/api/student', async (req, res) => {
  try {
    const list = await Student.find();
    res.send(list);
    console.log("Fetched all students");
  } catch (error) {
    res.status(500).send({ message: "Error fetching students." });
  }
});

app.put('/api/student/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedStudent) {
      return res.status(404).send({ message: "Student record not found." });
    }
    
    res.status(200).send(updatedStudent);
    console.log(`Updated attendance for student: ${updatedStudent.name}`);
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).send({ message: "Error updating attendance record." });
  }
});

app.listen(3000, () => console.log('API is running on port 3000'));
