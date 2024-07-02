const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.set('trust proxy', 1);

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Anonymous';
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let location = 'New York';
    let latitude = 40.7128; 
    let longitude = -74.0060; 

    try {
        
        const geoResponse = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${clientIP}`);
        console.log('Geo API Response:', geoResponse.data); 

        location = geoResponse.data.city || location;
        latitude = geoResponse.data.latitude || latitude;
        longitude = geoResponse.data.longitude || longitude;
    } catch (error) {
        console.error('Error fetching location data:', error.message);
    }

    
    let temperature = 11;

    
    try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
        console.log('Weather API Response:', weatherResponse.data); // Log weather API response for debugging

        temperature = weatherResponse.data.main.temp;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }

    
    const response = {
        client_ip: clientIP,
        location: location,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    
    res.json(response);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
