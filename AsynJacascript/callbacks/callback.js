const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log(result.body);
      fs.writeFile("dog-img.txt", result.body.message, (err) => {
        console.log("Random image saved file");
      });
    });
});
