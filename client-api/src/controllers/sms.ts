import resolver from "../resolvers/capture";

export function createSMSCapture(req, res) {
  const twilio = require("twilio");

  const twiml = new twilio.TwimlResponse();
  const body = req.body.Body;

  resolver.Mutation.createCapture(null, { body: body }, null)
    .then(graph => {
      return twiml.message(`Successfully saved capture`);
    })
    .catch(err => {
      const message = `Failed to save capture. Error message: ${err}`;
      console.log(message);
      return twiml.message(message);
    })
    .then(message => {
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
    });
}
