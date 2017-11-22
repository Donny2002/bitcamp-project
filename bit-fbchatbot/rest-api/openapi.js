const request = require('request');

const searchNewAddress = (searchWord) => {

request({
    url: 'http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd',
    qs: {
      'ServiceKey':
      'Q0%2F5veStQSrxZRk9f0qnSIqr%2FsTPLesgi2wXtjGGxmEXAuTiaRDV1PVC7j0ylPRl52f0Eun78uTE8RLTXh9FXA%3D%3D',
      'searchSe':'dong',
      'srchwrd':encodeURIComponent(searchWord),
      'countPerPage':'10',
      'currentPage':'1',

    },
    method: 'GET',

  }, function(error, response, body) {
      console.log('Status', response.statusCode);
      console.log('Headers', JSON.stringify(response.headers));
      console.log('Reponse received', body);
  });
};

searchNewAddress('상갈동');
/*
module.exports = {
  searchNewAddress
};
*/
