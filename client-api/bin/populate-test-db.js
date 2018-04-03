const fs = require("fs");
const request = require("graphql-request").request;
const _ = require("lodash");

// endpoint
const URL = "https://client-api-dot-opit-193719.appspot.com/graphql";

// path to test dir
const path = process.argv[2];

fs.readdir(path, (err, dirs) => {
  dirs.forEach(dir => {
    fs.readdir(`${path}/${dir}`, (err, files) => {
      files.forEach(file => {
        var lineReader = require("readline").createInterface({
          input: require("fs").createReadStream(`${path}/${dir}/${file}`)
        });
        lineReader.on("line", line => {
          let trimmedLine = _.trim(line);
          if (trimmedLine === "") {
            return;
          }

          let mutation = `
            mutation {
              createCapture(body: "${trimmedLine}") {
                captures {
                  body
                }
              }
            }
          `;

          console.log(mutation);

          request(URL, mutation);
        });
      });
    });
  });
});
