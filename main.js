const mqtt = require('mqtt');
var http = require('http');

class Mqtt {
    constructor() {
        this.client = mqtt.connect("mqtt://localhost");

        this.client.on('connect', () => {
            this.client.subscribe("image-display", (err) => {
                if (!err) {
                    console.log("Connected to image-display");
                }
            });
        });
    
        this.client.on('message', (topic, message) => {
            if (topic == "image-display") {
                console.log(message);
                this.postHttp(message);
            }
        });
        this.postHttp = function (message) {
            var options = {
                port: '80',
                method: 'POST',
                headers: {
                    'Content-Type': 'image/png',
                    'Content-Length': Buffer.byteLength(message)
                }
            };
            var post_req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    console.log('Response: ' + chunk);
                });
            });
            post_req.write(message);
            post_req.end();
        }
    }
}

let mqttClient = new Mqtt();
