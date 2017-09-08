const { MessagingResponse, VoiceResponse } = require('twilio').twiml;
const randomPuppy = require('random-puppy');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.post('/record', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say('Please leave your message after the beep.');
  twiml.record({
    timeout: 10,
    transcribe: true
  });

  console.log('recording phone call');
  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/sms/reply', (req, res) => {
  const twiml = new MessagingResponse();
  const message = twiml.message();

  randomPuppy()
    .then((url) => {
      message.body('Have a pupper');
      message.media(url);

      console.log('sending success text');
      res.type('text/xml');
      res.send(twiml.toString());
    })
    .catch((err) => {
      message.body('There was a problem getting a pupper');

      console.log('sending error text');
      res.type('text/xml');
      res.send(twiml.toString());
    });
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
