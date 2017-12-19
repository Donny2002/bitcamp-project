const awsIot = require('aws-iot-device-sdk');

// Shadow를 등록할 장비명
const thingName = 'dev01';

// AWS IoT 서버에 등록된 Thing 정보를 바탕으로 Shadow 제어 장비를 준비시킨다.
var thingShadows = awsIot.thingShadow({
  keyPath: "dev01.private.key", // 개인키 파일
  certPath: "dev01.cert.pem", // 인증서 파일
  caPath: "root-CA.crt", // 인증서를 발행한 회사에 대한 인증서
  clientId: "donnybot", // Id는 본인이 정함
  host: "a1h8rscof81ucx.iot.ap-northeast-2.amazonaws.com"
});

// Thing의 Shadow 제어 장비가 준비되었을 때 호출될 함수 등록
thingShadows.on('connect', function() {
  console.log('Shadow ready');

  // 지정한 Thing에 대해 Shadow 연결을 요청한다.
  // => Shadow 등록에 성공한다면 설정된 함수가 호출됨
  thingShadows.register('thingName', {}, function() {
    console.log('Shadow에 연결 하였음!');

    // 장비가 준비되면 일단 Shadow 설정된 값을 가져온다.
    console.log('섀도우에 설정된 값 조회를 요청한다.');
    thingShadows.get('dev01');
  });
});

// 지정된 타임아웃 시간이 경과했을 때 호출될 함수 등록
thingShadows.on('timeout',
  function(thingName, clientToken) {
    console.log('received timeout on ' + thingName +
      ' with token: ' + clientToken);
  });

function update(desiredObj) {
  thingShadows.update('thingName', {
    state: {
      desired: desiredState
    }
  });
}

module.exports = {
  update
};
