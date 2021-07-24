const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject("File Not Found");
      }
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write to the file");
      resolve("Random image saved file");
    });
  });
};

readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((result) => {
    console.log(result.body);
    return writeFilePro("dog-img.txt", result.body.message);
  })
  .then(console.log)
  .catch((err) => console.warn(err.message || err));
