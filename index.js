var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot');
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
})

// Here is the bot interaction //

// to post data back to user
app.post('/webhook/', function (req, res) {
	messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		sender = event.sender.id;
		if (event.message && event.message.text) {
			text = event.message.text;
			if (text === 'Generic') {
				sendGenericMessage(sender);
				continue;
				// Checks and accounts for all types of Wtf, or wTf, or wtF, etc
			} else if (text.toUpperCase() === 'WTF') {
				watchYourLanguage(sender);
				continue;
			}
			sendTextMessage(sender, text.substring(0, 200));
		}
		if (event.postback) {
			text = JSON.stringify(event.postback);
			sendTextMessage(sender, text.substring(0, 200));
			continue;
		}
	}
	res.sendStatus(200);
});

// Our token which was authed by facebook
var token = "CAAHrm2AtZB7ABAJz5wdCtZAKCKNhtQnn2OfjKRJKEkmQzShF1B2gHY50PDvb1W4MEgMuqb0pYNuGSMVOitrYaezRDhyg1ZCbX973PhuOaIniKGNqZAHKyzfTdjNpZAaVPzI8zuwZC36ux2c0nqWfoLjZBSOzFErQbtZCqpoNI0es3irNelHxjQ8xmuZCZCYwJM0ZB3iS3KwDXgMEQZDZD";

// Echos back messages
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


// Shows the card view
function sendGenericMessage(sender) {
	messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	};
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) { // Error handling
		if (error) {
			console.log('Error sending messages: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}

// Show the watch your language message
function watchYourLanguage(sender) {
	messageData = {
		// How to send text back to user
		text: "watch your language",
	};
	// Makes the request
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) { // Error handling
		if (error) {
			console.log('Error sending messages: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
});
