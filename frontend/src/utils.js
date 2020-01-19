const isEmailValid = (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const isValidURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const formatURL = (url) => {
  if (url) {
    return url.includes('http') ? encodeURI(url) : encodeURI(`//${url}`);
  }
  return null
}

const hasSchedule = (schedules) => {
  if(schedules){
    return Object.keys(schedules).some((k) => schedules[k] !== '')
  }

  return false;
}

const sameSchedule = (scheduleOne, scheduleTwo) => {
  if(scheduleOne && scheduleTwo){
    return Object.keys(scheduleOne).every(k => scheduleOne[k] === scheduleTwo[k]);
  }

  return true;
}

export {
  isEmailValid,
  isValidURL,
  formatURL,
  hasSchedule,
  sameSchedule,
}
