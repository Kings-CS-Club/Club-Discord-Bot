module.exports = url => {
  let promise = new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if(error) {
        reject();
        console.log(`[${Date.now()}] Error recieved from request module:`);
        throw new Error(error);
      }
  
      try {
        let json = JSON.parse(body);
        resolve(json);
      } catch(error) {
        reject();
        console.log(`[${Date.now()}] JSON [${body}] is invalid.`);
      }
    });
  });

  return promise;
}