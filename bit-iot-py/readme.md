# Python으로 AWS IoT 사용하기

## 프로젝트 준비
- Python 설치 확인
  - python --version
  - python3 --version
  
- python ssl 버전 확인
  - python
    >>> import ssl
    >>> ssl.OPENSSL_VERSION
    - 암호 모듈의 버전이 1.0 이상 이여야 한다!
    - python3
    >>> import ssl
    >>> ssl.OPENSSL_VERSION
