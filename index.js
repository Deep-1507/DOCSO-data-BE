require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// Define the Doctor schema
const doctorSchema = new mongoose.Schema({
    DrName: String,
    FirmName: String,
    email: String,
    YOEstablishment: String,
    totJdReviews: String,
    building: String,
    street: String,
    area: String,
    pincode: String,
    PhoneNumber: String,
    city: String,
    qualification: String,
    award_certificate: Array,
    Firm_Images: Array,
    addressln: String,
    categories: Array,
}, { collection: 'doctor_details' }); // Specify the collection name

// Create the Doctor model
const Doctor = mongoose.model('Doctor', doctorSchema);

// Route to search for doctors
app.post('/search', async (req, res) => {
    const { DrName, FirmName, email, city, categories } = req.body;
    console.log('Received request body:', req.body);

    const query = {};
    
    if (DrName) {
        query.DrName = new RegExp(DrName, 'i');
    }
    if (FirmName) {
        query.FirmName = new RegExp(FirmName, 'i');
    }
    if (email) {
        query.email = new RegExp(email, 'i');
    }
    if (city) {
        query.city = new RegExp(city, 'i');
    }
    if (categories && categories.length > 0) {
        query.categories = { $in: categories };
    }

    console.log('Query:', query);

    try {
        const doctors = await Doctor.find(query);
        console.log('Doctors found:', doctors);
        res.json(doctors);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Server error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
