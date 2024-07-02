const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Trusting proxy headers
app.set('trust proxy', true);

// Endpoint handler
app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Anonymous';
    const clientIP = req.ip;

    let location = 'New York';
    let latitude = 40.7128; // Default latitude for New York
    let longitude = -74.0060; // Default longitude for New York

    try {
        // Attempt to get location data from IP
        const geoResponse = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${clientIP}`);
        console.log('Geo API Response:', geoResponse.data); // Log geo API response for debugging

        location = geoResponse.data.city || location;
        latitude = geoResponse.data.latitude || latitude;
        longitude = geoResponse.data.longitude || longitude;
    } catch (error) {
        console.error('Error fetching location data:', error.message);
    }

    // Default temperature value
    let temperature = 11;

    try {
        // Get weather data from OpenWeatherMap
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
        console.log('Weather API Response:', weatherResponse.data); // Log weather API response for debugging

        temperature = weatherResponse.data.main.temp;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }

    // Prepare response object
    const response = {
        client_ip: clientIP,
        location: location,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    // Send JSON response
    res.json(response);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
