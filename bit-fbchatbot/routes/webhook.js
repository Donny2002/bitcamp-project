// webhook은 유효한 것인지 판단하는 부분
// nodeJS에서 Express 모듈을 사용할 경우
// 다음과 같이 express의 라우터 객체에 클라이언트 요청을 처리할 함수를 등록
//import express from 'express';
const express = require('express');

// 메시지 이벤트를 처리할 API를 가져온다
const receiveAPI = require('../messenger-api-helpers/receive');
const router = express.Router();

// 페이스북 서버에서 이 서버의 유효성을 검사하기 위해 요청
// webhook.js는 클라이언트에서 URL '/webhook.js'에서 처리
router.get('/', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

// Message processing
// 사용자가 페이스북 페이지로 메세지를 보낸다
// 페이스북 메신저 서버가 이 서버의 '/webhook' URL로 post 요청을 보낸다
// 이 서버는 이 post 요청을 처리한 후 응답한다
// 페이스북 메신저 서버가 사요자에게 메세지를 보낸다
// 사용자의 메신저에 응답 내용 출력된다
// Message processing
router.post('/', (req, res) => {
  // 메신저 서버에서 요청을 받으면 일단 응답. 응답 후 요청 처리 작업 실행.
  res.sendStatus(200);
  // 응답한 후 요청을 처리하는 작업을 처리(20초 이내에 응답해야하는 규칙)
  // 메신저 서버가 보낸 답을 꺼냄
  var data = req.body;

  // Make sure this is a page subscription
  // 챗봇에 연결된 페이지가 받을 메시지인지 검사
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    // 페이지가 받은 데이터 덩어리(entry)가 여러 개일 수 때문에 반복적으로 처리
    data.entry.forEach(function(entry) {
      // 메시지 관련 데이터가 들어 있지 않다면 요청 처리 종료
      if (!entry.messaging) {
        return;
      }

      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        // 접속한 사용자의 상태 정보를 저장할 객체를 준비한다.
        // => 일종의 세션 객체로서 역할을 할 것이다.
        var senderID = event.sender.id;
        if (!global[senderID]) { // 접속한 사용자를 위한 보관소가 없다면,
          global[senderID] = {
            'user': senderID
          }; // 빈 보관소를 만들어 글로벌 객체에 저장한다.
        }

        if (event.message) {
          console.log('event.message==>', event.message); //실행과정 이해를 위한 로그
          receiveAPI.handleReceiveMessage(event);

        } else if (event.postback) {
          console.log('event.postback==>', event.postback); //실행과정 이해를 위한 로그
          receiveAPI.handleReceivePostback(event);

        } else {
          // console.log("unknown event==> ", event); //모르는 이벤트
        }
      }); // entry.message.forEach();
    }); // data.entry.forEach();
  }
});

module.exports = router;
