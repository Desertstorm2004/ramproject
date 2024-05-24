const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error in connecting to database"));
db.once('open', () => console.log("Connected to database"));

// User Schema
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    dob: String,
    gender: String,
    mobile: String,
    email: String,
    rollno: String,
    username: String,
    password: String,
    confirmpassword: String
});

const User = mongoose.model('User', userSchema);

// Register route
app.post("/register", async (req, res) => {
    try {
        const userData = new User(req.body);
        await userData.save();
        console.log("Record Inserted Successfully");
        res.redirect('educationdetails.html');
    } catch (err) {
        console.error("Error in saving user data", err);
        res.status(500).send("Error in saving user data");
    }
});

// Education details route
app.post("/education", async (req, res) => {
    try {
        const data = {
            collegeName: req.body.collegeName,
            rollNo: req.body.rollNo,
            semester: req.body.semester,
            education: req.body.education,
            branch: req.body.branch,
            passingYear: req.body.passingYear,
            sgpa: req.body.sgpa,
            cgpa: req.body.cgpa,
            skill: req.body.skill,
            additionalSkills: req.body.additionalSkills,
            resume: req.body.resume
        };
        await db.collection('educationaldetails').insertOne(data);
        console.log("Record Inserted Successfully");
        res.redirect('student.html');
    } catch (err) {
        console.error("Error in inserting educational details", err);
        res.status(500).send("Error in inserting educational details");
    }
});

// Company details route
app.post("/company", async (req, res) => {
    try {
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            mobile: req.body.mobile,
            email: req.body.email,
            rollNo: req.body.rollNo,
            username: req.body.username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };
        await db.collection('educationaldetails').insertOne(data);
        console.log("Record Inserted Successfully");
        res.redirect('faculty.html');
    } catch (err) {
        console.error("Error in inserting company details", err);
        res.status(500).send("Error in inserting company details");
    }
});

// Login route for companies
app.post("/companylogin", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find company by username (case insensitive)
        const company = await db.collection('educationaldetails').findOne({ username: { $regex: new RegExp(username, "i") } });
        if (!company) {
            // If company not found, send error response
            res.status(401).send("Invalid credentials");
            return;
        }

        // Compare plaintext passwords
        if (company.password !== password) {
            // If passwords don't match, send error response
            res.status(401).send("Invalid credentials");
            return;
        }

        // Set company session if needed

        // Redirect to appropriate page after successful login
        res.redirect('companylogin.html'); // Change '/company-dashboard' to the desired URL
    } catch (err) {
        console.error("Error in finding company", err);
        res.status(500).send("Error in finding company");
    }
});

// Login route for students
app.post("/studentlogin", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find student by username (case insensitive)
        const student = await db.collection('users').findOne({ username: { $regex: new RegExp(username, "i") } });
        if (!student) {
            // If student not found, send error response
            res.status(401).send("Invalid credentials");
            return;
        }

        // Compare plaintext passwords
        if (student.password !== password) {
            // If passwords don't match, send error response
            res.status(401).send("Invalid credentials");
            return;
        }

        // Set student session if needed

        // Redirect to appropriate page after successful login
        res.redirect('/studentlogin.html');
    } catch (err) {
        console.error("Error in finding student", err);
        res.status(500).send("Error in finding student");
    }
});

// Job Schema
const jobSchema = new mongoose.Schema({
    companyName: String,
    branch: String,
    role: String,
    qualification: String,
    requiredSkill: String,
    extraSkill: String,
    maxAge: Number,
    jobLocation: String,
    salary: String,
    workingHour: Number,
    description: String,
    lastApplyDate: Date
});

const Job = mongoose.model('Job', jobSchema);

// Job posting route
app.post("/addjob", async (req, res) => {
    try {
        const jobData = new Job(req.body);
        await jobData.save();
        console.log("Job Posted Successfully");
        res.redirect('companylogin.html');
    } catch (err) {
        console.error("Error in posting job", err);
        res.status(500).send("Error in posting job");
    }
});

// Root route
app.get("/", (req, res) => {
    res.set({ "Allow-access-Allow-Origin": '*' });
    res.redirect('index.html');
});

// Start the server
app.listen(3002, () => {
    console.log("Listening on port 3002");
});
