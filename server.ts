import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';

// Create an Express application
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'licenta',
  database: 'responses',
  waitForConnections: true,
  connectionLimit: 10,
  port: 3306
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
  }
})();

// Route to handle survey submission
app.post('/api/submit-survey', async (req: Request, res: Response) => {
  const surveyData = req.body;
  const ipAddress = req.ip;  // Capture the IP address of the user

  // First, check if a survey has already been submitted from this IP address
  const checkQuery = `SELECT COUNT(*) AS count FROM survey WHERE ip_adress = ?`;
  const [checkResult] = await pool.execute(checkQuery, [ipAddress]);

  // Explicitly type the result to avoid "any" type
  const { count } = (checkResult as mysql.RowDataPacket[])[0];

  if (count > 0) {
    return res.status(400).send({ error: 'You can only submit one survey per IP address.' });
  }

  // Proceed to insert the survey data if no existing survey from this IP
  const query = `
    INSERT INTO survey (
      age, gender, education, sector, neighborhood, residenceDuration, mainTransport, trafficIssues, 
      timeInTraffic, parkingEase, cityCenterParkingEase, illegalParking, undergroundParking, 
      biggestTrafficProblem, trafficImprovements, bikeLanesSatisfaction, bikeLaneSafety, 
      cleanlinessPublicTransport, publicTransportSufficiency, metroStationsNumber, 
      preferBikeIfBetterInfrastructure, bikeImprovements, neighborhoodSatisfaction, legalConstruction, 
      sidewalkSpace, sunCoveredAreas, benchesAvailability, illegalParkingMeasures, 
      otherIssues, additionalExperience, ip_adress
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    surveyData.age || null,
    surveyData.gender || null,
    surveyData.education || null,
    surveyData.sector || null,
    surveyData.neighborhood || null,
    surveyData.residenceDuration || null,
    surveyData.mainTransport || null,
    surveyData.trafficIssues || null,
    surveyData.timeInTraffic || null,
    surveyData.parkingEase ? parseInt(surveyData.parkingEase, 10) : null,
    surveyData.cityCenterParkingEase ? parseInt(surveyData.cityCenterParkingEase, 10) : null,
    surveyData.illegalParking || null,
    surveyData.undergroundParking || null,
    surveyData.biggestTrafficProblem || null,
    surveyData.trafficImprovements || null,
    surveyData.bikeLanesSatisfaction ? parseInt(surveyData.bikeLanesSatisfaction, 10) : null,
    surveyData.bikeLaneSafety ? parseInt(surveyData.bikeLaneSafety, 10) : null,
    surveyData.cleanlinessPublicTransport ? parseInt(surveyData.cleanlinessPublicTransport, 10) : null,
    surveyData.publicTransportSufficiency || null,
    surveyData.metroStationsNumber || null,
    surveyData.preferBikeIfBetterInfrastructure || null,
    surveyData.bikeImprovements || null,
    surveyData.neighborhoodSatisfaction ? parseInt(surveyData.neighborhoodSatisfaction, 10) : null,
    surveyData.legalConstruction || null,
    surveyData.sidewalkSpace || null,
    surveyData.sunCoveredAreas || null,
    surveyData.benchesAvailability || null,
    surveyData.illegalParkingMeasures || null,
    surveyData.otherIssues || null,
    surveyData.additionalExperience || null,
    ipAddress // Add the IP address to the survey data
  ];

  try {
    const [result] = await pool.execute(query, values);
    return res.status(201).send({ message: 'Survey submitted successfully', result });
  } catch (error) {
    console.error('Error saving survey data:', error);
    return res.status(500).send({ error: 'Failed to submit survey data' });
  }
});

// Route to get survey responses
app.get('/api/get-responses', async (req: Request, res: Response) => {
  const sql = `SELECT * FROM survey`;

  try {
    const [results] = await pool.execute(sql);
    return res.status(200).json({ message: 'Survey responses fetched successfully', data: results });
  } catch (err: any) {
    console.error('Error retrieving data from the database:', err.message);
    return res.status(500).json({ message: 'Error fetching survey responses', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
