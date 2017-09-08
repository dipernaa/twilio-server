const { MessagingResponse, VoiceResponse } = require('twilio').twiml;
const randomPuppy = require('random-puppy');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/conference', (req, res) => {
  const twiml = new VoiceResponse();

  if (req.body.Digits) {
    const dial = twiml.dial();
    dial.conference({
      record: 'record-from-start'
    }, `Room ${req.body.Digits}`);
  } else {
    const gather = twiml.gather();
    gather.say('Please enter your conference number, followed by the pound sign.');
    twiml.say('We didn\'t receive any input. Goodbye.');
  }

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
