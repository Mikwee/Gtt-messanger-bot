const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const server = app.listen(process.env.PORT || 80, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const PAGE_ACCESS_TOKEN = "EAAau3YEyVjMBAHd2tca2y6CsW1JIdSkEpN0ZA2FDZBZBHmnOE0rdwcJn6Ev3Qs68ozVk3VrGlZB1pmDwa3q9BlQdV5aBcNvkZCv2PBpG5l2NVwEFGZCF0YrazzABpd0y2pgW7PIE3JZC0rPHglgLT2sgHZCzBxqUQ57yHL777Ie5uwZDZD";

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'tuxedo_cat') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});

/* Handling all messenges */
app.post('/webhook', (req, res) => {
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                var attachment = event.message.attachments[0];
                if (attachment.type == "image") {
                    sendMessage(event.sender.id, attachment.payload.url);
                }
            });
        });
        res.status(200).end();
    }
});

function sendMessage(sender, message) {

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: {
                text: message
            }
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });

}
