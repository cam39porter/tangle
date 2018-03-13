import { insertCapture } from "../db/gcloud-server";
import { Capture } from "../models/capture";

export function createSMSCapture(req, res) {
  const MessagingResponse = require("twilio").twiml.MessagingResponse;
  const twiml = new MessagingResponse();
  const body = req.body.Body;

  const capture = new Capture(null, body);
  insertCapture(capture)
    .then(retCapture => {
      return twiml.message(
        `Successfully saved capture with id ${retCapture.id}`
      );
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
