const fs = require("fs");
const request = require("graphql-request").request;
const _ = require("lodash");
const sleep = require("sleep");

// endpoint
const URL = "https://client-api-dot-opit-193719.appspot.com/graphql";

// path to test dir
const path = process.argv[2];

fs.readdir(path, (err, files) => {
  files.forEach(file => {
    var lineReader = require("readline").createInterface({
      input: require("fs").createReadStream(`${path}/${file}`)
    });
    lineReader.on("line", line => {
      sleep.msleep(100);
      let trimmedLine = _.trim(line);
      if (trimmedLine === "") {
        return;
      }

      let mutation = `
            mutation {
              createCapture(body: "${trimmedLine}") {
                nodes { id } 
              }
            }
          `;

      console.log(mutation);

      request(URL, mutation);
    });
  });
});
