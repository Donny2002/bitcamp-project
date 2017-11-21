// ===== MODULES ===============================================================
//import express from 'express';
const express = require('express');

// 클라이언트 요청이 들어왔을 때 함수를 호출해주는 객체
const router = express.Router();

// 요청 URL에 대해 호출될 함수 등록
router.get('/', (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain;charset=UTF-8'
  })
  response.write('/Hello!...\n')
  response.end()
})

router.get('/test1', (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain;charset=UTF-8'
  })
  response.write('test1...\n')
  response.end()
})

//export default router;
module.exports = router;
