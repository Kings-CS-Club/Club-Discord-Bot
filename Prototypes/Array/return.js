module.exports = function(action) {
  if(typeof action !== 'function') {
    throw new TypeError('Argument 0 of <Array>.return must be of type \'Function\'');
  }

  let res = new Array();
  this.forEach(item => {
    res.push(action(item));
  });

  return res;
};