const express = require('express');
const request = require('request');

const config = require('../config.json')
const secrets = require('../secrets.json')

const router = express.Router();

router.route('/')
  .post((req, res) => {
    const snipsMessage = req.body;
    console.log(JSON.stringify(snipsMessage));

    // poll OpenWeatherMap api for current weather ...
    request({
      url: `http://api.openweathermap.org/data/2.5/weather?q=${config.city},${config.country}&APPID=${secrets.apiKey}`,
      method: 'GET'
    }, (error, response, body) => {
      let responseText = '';
      const apiResult = JSON.parse(body);

      // send api result to dashboard...
      request({
        url: `http://localhost:3000/apps/weather`,
        method: 'POST',
        json: apiResult,
      });

      // ... and make response for assistant from result...
      if (error) {
        console.log(error.message);
        responseText = `Error. ${error.message}`;
      } else {
        responseText = `The weather is ${apiResult.weather[0].main} in ${config.city}. It is ${Math.round(apiResult.main.temp - 273.15)} degrees celsius.`
      }

      // ... and send it to assistant
      res.json({ responseText });
    })
  });

module.exports = router;