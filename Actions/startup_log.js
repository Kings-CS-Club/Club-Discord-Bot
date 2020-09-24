module.exports = () => {
  let promise = new Promise((resolve, reject) => {
    try {
      let Now = new Date();
      console.log(`Bot Started on ${Now.toDateString()} | ${Now.toTimeString()}.`);
      resolve();
    } catch(error) {
      reject(error);
    }
  });

  return promise;
};