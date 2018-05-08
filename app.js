//https://github.com/watson-developer-cloud/node-sdk/blob/master/examples/conversation.v1.js



/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var watson = require('watson-developer-cloud'); // watson sdk
var request = require('request');
const externalAPI = require('./firstLibraryAttempt.js');
const watsonMessage = require('./watsonMessage.js');

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper

var assistantInstance = new watson.AssistantV1({
  // If unspecified here, the ASSISTANT_USERNAME and ASSISTANT_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  username: process.env.ASSISTANT_USERNAME || '<username>',
  password: process.env.ASSISTANT_PASSWORD || '<password>',
  version: '2018-02-16'
});

var workspace = process.env.WORKSPACE_ID || '<workspace-id>';

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {


  const enrichConversation = data =>
      message(req, workspace, assistantInstance)
        .then(response => {
          //console.log(JSON.stringify(response, null, 2), '\n--------');
          response.output.text += data

          res.json(response)
        })
        .catch(err => {
          // APPLICATION-SPECIFIC CODE TO PROCESS THE ERROR
          // FROM CONVERSATION SERVICE
          console.error(JSON.stringify(err, null, 2));
          res.status(err.code || 500).json(err)
        });



  externalAPI.MeLiPromise.then(googleResponse => {
      enrichConversation(googleResponse)
  })
  .catch(err => {
    res.status(err.code || 500).json(err)
  });

});



const message = (req, workspace, assistant) => {
    var payload = {
      workspace_id: workspace,
      context: req.body.context || {},
      input: req.body.input || {}
    };

    const watsonPromise = new Promise((resolve, reject) => {
        // Send the input to the assistant service
        assistant.message(payload, function(err, data) {
            if (err) {
              reject(err);
            }


            resolve(watsonMessage.updateMessage(payload, data));
        });
      });



    return watsonPromise;

};


module.exports = app;
