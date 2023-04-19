const TokenKey = 'Admin-Token';

export function getToken() {
  let expireAt = localStorage.getItem('tokenExpireAt');
  let nowTime  = parseInt(new Date().getTime() / 1000);
  if(expireAt && nowTime < expireAt ){
      return localStorage.getItem(TokenKey);
  }
}

export function setToken(token,expireAt=null) {
  localStorage.setItem(TokenKey, token);
  localStorage.setItem('tokenExpireAt', expireAt);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
  localStorage.removeItem('tokenExpireAt');
}
