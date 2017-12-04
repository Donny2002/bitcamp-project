const api = require('./api');
const sendAPI = require('./send');

const postbackHandler = {};

const addPostback = (postback, handler) => {
  postbackHandler[postback] = handler;
}

// 등록된 postbackHandler를 찾아서 리턴한다.
const getHandler = (postback) => {
  return postbackHandler[postback];
};

addPostback('/led', (recipientId) => {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "LED 스위치!",
          "buttons": [{
              "type": "postback",
              "title": "ON",
              "payload": "/led/on"
            },
            {
              "type": "postback",
              "title": "OFF",
              "payload": "/led/off"
            }
          ]
        }
      }
    }
  };
  api.callMessagesAPI(messageData);
});

addPostback('/led/on', (recipientId) => {
  sendAPI.sendTextMessage(recipientId, 'LED를 켭니다.');
});

addPostback('/led/off', (recipientId) => {
  sendAPI.sendTextMessage(recipientId, 'LED를 끕니다.');
});

module.exports = {
  getHandler
};
