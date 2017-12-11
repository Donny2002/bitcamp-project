#
# AWS IoT 파이썬 라이브러리 및 관련 라이브러리 로딩
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import time
import argparse
import json

# Custom MQTT message callback
# AWS IoT 서버에서 메시지를 받았을 때 호출될 함수 정의
def customCallback(client, userdata, message):
    print("메시지를 수신하였습니다! \n")
    print("사서함 이름: ")
    print(message.topic)
    print("메시지 내용: ")
    print(message.payload)
    print("\n")
    print("--------------\n")


host = "a1h8rscof81ucx.iot.ap-northeast-2.amazonaws.com"
rootCAPath = "root-CA.crt"
certificatePath = "dev01.cert.pem"
privateKeyPath = "dev01.private.key"
useWebsocket = False
clientId = "client2"
topic = "topic_1"

# Configure logging
# 실행하면서 로그를 남기기 위한 설정
logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

# AWSIoTMQTTClient 초기화
myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
myAWSIoTMQTTClient.configureEndpoint(host, 8883)
myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# AWSIoTMQTTClient 연결에 대한 제어 정보 설정
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

# AWS IoT에 등록된 Things과 연결
myAWSIoTMQTTClient.connect()
print("connect \n")


myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
