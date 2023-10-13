const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('patient_data.db');

app.use(express.json());

// Create a table for patient data (if it doesn't already exist)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS patient_data (
    id INTEGER PRIMARY KEY,
    heartRate INTEGER,
    bodyTemperature INTEGER,
    patientName TEXT,
    patientNID TEXT,
    patientFrequentSickness TEXT
  )`);
});

// Handle POST requests for patient data
app.post('/api/patient-data', (req, res) => {
  const patientData = req.body;

  // Insert patient data into the database
  const insertPatientData = db.prepare(`INSERT INTO patient_data (
    heartRate, bodyTemperature, patientName, patientNID, patientFrequentSickness
  ) VALUES (?, ?, ?, ?, ?)`);

  insertPatientData.run(
    patientData.heartRate,
    patientData.bodyTemperature,
    patientData.patientName,
    patientData.patientNID,
    patientData.patientFrequentSickness
  );

  insertPatientData.finalize();

  res.status(200).json({ message: 'Patient data received and stored successfully' });
});
// Add a new route to retrieve patient data
app.get('/api/patient-data', (req, res) => {
  db.all('SELECT * FROM patient_data', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
