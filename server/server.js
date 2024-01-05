const express = require('express');
const bodyParser = require('body-parser');
const {executeQuery} = require('./db'); // Assuming js is in the same directory
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  
app.use(bodyParser.json());
  
app.post('/api/signup-users', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    try {
      const existingUser = await executeQuery(`SELECT * FROM users WHERE username = '${username}' OR email = '${email}'`);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 11);
  
      const result = await executeQuery(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`);
  
      console.log(result);
      res.status(201).json(result[0]);
    } catch (error) {
      console.log('Error signing up user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.post('/api/signup-admin', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    try {
      const existingUser = await executeQuery(`SELECT * FROM admin WHERE username = '${username}' OR email = '${email}'`);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 11);
  
      const result = await executeQuery(`INSERT INTO admin (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}')`);
  
      console.log(result);
      res.status(201).json(result[0]);
    } catch (error) {
      console.log('Error signing up user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/api/login-users', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await executeQuery(`SELECT * FROM users WHERE username = '${username}' OR email = '${username}'`);
      if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid username' });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate a JWT token for authentication
      const token = jwt.sign({ user_id: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: user[0] });
    } catch (error) {
      console.error('Error logging in user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/login-admin', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await executeQuery(`SELECT * FROM users WHERE username = '${username}' OR email = '${username}'`);
      if (user.length === 0) {
        return res.status(401).json({ error: 'Invalid username' });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user[0].password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate a JWT token for authentication
      const token = jwt.sign({ user_id: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
       res.json({ token, user: user[0] });
    } catch (error) {
      console.error('Error logging in user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/api/all-flights', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = req.query.pageSize || 10;
        const { from, to, date } = req.body;

        const startIndex = (page - 1) * pageSize;

        let query = 'SELECT * FROM flight';

        // Add WHERE conditions based on search parameters
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        if (from || to || date) {
            query += ' WHERE';

            if (from) query += ` LOWER(f_from) LIKE LOWER('%${from}%')`;
            if (to) query += ` ${from ? 'AND' : ''} LOWER(f_to) LIKE LOWER('%${to}%')`;
            if (date) query += ` ${from || to ? 'AND' : ''} f_date='${date}'`;
            // if (date) {
            //     query += ` ${from || to ? 'AND' : ''} f_date BETWEEN '${currentDate}' AND '${date}'`;
            // } else {
            //     // If no specific date is provided, consider flights starting from the current date
            //     query += ` ${from || to ? 'AND' : ''} f_date >= '${currentDate}'`;
            // }
        }

      

        query += ' ORDER BY f_date, f_arrive';
        query += ` LIMIT ${startIndex}, ${pageSize};`;

        const totalFlightsQuery = `SELECT COUNT(*) AS count FROM flight;`;

        const totalFlights = await executeQuery(totalFlightsQuery);
        const flights = await executeQuery(query);

        if (flights.length > 0) {
            return res.status(200).json({
                flights,
                totalFlights: totalFlights[0].count,
                currentPage: page,
                totalPages: Math.ceil(totalFlights[0].count / pageSize),
            });
        } else {
            return res.status(200).json({ message: 'No flights found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/api/update', async (req, res) => {
  const { flight_id, user_id, age, name } = req.body;
  console.log(req.body);
  try {
    // Update the flight availability
    const updateFlightQuery = `UPDATE flight SET avt = avt - 1 WHERE f_id = ${flight_id};`;
    const updateFlightResult = await executeQuery(updateFlightQuery);

    if (updateFlightResult.affectedRows === 0) {
      return res.sendStatus(404); // Flight not found or no available seats
    }

    // Insert a new ticket for the user
    const getFlightDetailsQuery = `SELECT * FROM flight WHERE f_id = ${flight_id};`;
    const flightDetails = await executeQuery(getFlightDetailsQuery);

    if (flightDetails.length > 0) {
      const { f_name, f_from, f_to } = flightDetails[0];
      // const cost = 1000 //calculateTicketCost(f_name, f_from, f_to); // Implement this function based on your pricing logic

      const insertTicketQuery = `INSERT INTO ticket (f_id, user_id, age, name, stat) VALUES (${flight_id}, ${user_id}, ${age}, '${name}', 'Active');`;
      const insertTicketResult = await executeQuery(insertTicketQuery);

      if (insertTicketResult.affectedRows > 0) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500); // Failed to insert the ticket
      }
    } else {
      res.sendStatus(404); // Flight details not found
    }
  } catch (error) {
    console.error('Error updating flight and generating ticket', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server-side code (Express.js)
app.get('/api/user-tickets/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user's tickets with corresponding flight details
    const query = `
      SELECT ticket.*, flight.f_name, flight.f_from, flight.f_to, flight.f_date
      FROM ticket
      JOIN flight ON ticket.f_id = flight.f_id
      WHERE user_id = ${userId};
    `;
    const tickets = await executeQuery(query);

    // Send the tickets as a response
    res.json({ tickets });
  } catch (error) {
    console.error('Error fetching user tickets', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/add-flight', async (req, res) => {
  const { f_name, f_from, f_to, f_date, f_arrive, f_depart, avt } = req.body;

  try {
    // Validate input fields
    if (!f_name || !f_from || !f_to || !f_date || !f_arrive || !f_depart || !avt) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the flight already exists
    const existingFlight = await executeQuery(`SELECT * FROM flight WHERE f_name = '${f_name}' AND f_from = '${f_from}' AND f_to = '${f_to}' AND f_date = '${f_date}'`);
    if (existingFlight.length > 0) {
      return res.status(400).json({ error: 'Flight already exists' });
    }

    // Insert the new flight into the database
    const result = await executeQuery(
      `INSERT INTO flight (f_name, f_from, f_to, f_date, f_arrive, f_depart, avt) VALUES ('${f_name}', '${f_from}', '${f_to}', '${f_date}', '${f_arrive}', '${f_depart}', ${avt})`
    );

    // Check if the flight is added successfully
    if (result.affectedRows > 0) {
      res.status(201).json({ message: 'Flight added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add flight' });
    }
  } catch (error) {
    console.error('Error adding flight', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(5000, console.log("listening on port: 5000"));