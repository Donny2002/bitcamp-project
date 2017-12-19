// AWS IoT의 Thing Shadow에 값을 설정하고 꺼내는 방법

// AWS에서 제공하는 nodejs 모듈을 로딩한다.
var awsIot = require('aws-iot-device-sdk');

// Shadow를 등록할 장비명
const thingName = 'dev01';

// AWS IoT 서버에 등록된 Thing 정보를 바탕으로 Shadow 제어 장비를 준비시킨다.
var thingShadows = awsIot.thingShadow({
  keyPath: "dev01.private.key", // 개인키 파일
  certPath: "dev01.cert.pem", // 인증서 파일
  caPath: "root-CA.crt", // 인증서를 발행한 회사에 대한 인증서
  clientId: "client2", // Id는 본인이 정함
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

  /*
  Shadow가 존재한다면 이제 Shadow에 값을 저장할 수 있다
  update(Thing이름, 값)
  thingShadows.update('thingName', {
  state: {
  desired: {
  led: "on"
}
}
});
*/

  });
});

// Thing의 Shadow에 대해 명령을 지시하고 그 명령을 수행한 후에 호출될 함수 등록
thingShadows.on('status',
  function(thingName, stat, clientToken, stateObject) {
    if ((stat === "rejected") && (stateObject.code === 404)) {
      // Shadow의 값이 없다면, 기본값을 설정.
      console.log('섀도우에 값이 없어서 기본 값을 설정하였음!');
      thingShadows.update('thingName', {
        state: {
          desired: {
            led: "off"
          }
        }
      });
    } else {
      console.log('received ' + stat + ' on ' + thingName + ': ' +
        JSON.stringify(stateObject));
    }
  });

// Shadow의 상태가 변경 되었을 때 부가적으로 발생되는 이벤트가
// 발생하는데 그때 호출될 메서드 등록
thingShadows.on('delta',
  function(thingName, stateObject) {
    console.log('received delta on ' + thingName + ': ' +
      JSON.stringify(stateObject));
  });

// 지정된 타임아웃 시간이 경과했을 때 호출될 함수 등록
thingShadows.on('timeout',
  function(thingName, clientToken) {
    console.log('received timeout on ' + thingName +
      ' with token: ' + clientToken);
    //
    // In the event that a shadow operation times out, you'll receive
    // one of these events.  The clientToken value associated with the
    // event will have the same value which was returned in an earlier
    // call to get(), update(), or delete().
    //
  });
