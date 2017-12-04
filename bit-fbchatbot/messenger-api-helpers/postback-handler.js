const postbackHandler = {};

const addPostback = (postback, handler) => {
  postbackHandler[postback] = handler;
}

// 등록된 postbackHandler를 찾아서 리턴한다.
const getHandler = (postback) => {
  return postbackHandler[postback];
};

module.exports = {
  getHandler
};
