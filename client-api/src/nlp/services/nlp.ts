import language from "@google-cloud/language";
import { NLPEntity, NLPEntityResponse } from "../models/nlp";
import { Logger } from "../../util/logging/logger";

const LOGGER = new Logger("src/nlp/services/nlp.ts");

const client = new language.LanguageServiceClient({
  keyFilename: "/aws-gcp-key.json"
});
function getNLPResponse(body: string): Promise<NLPEntityResponse> {
  const document = {
    content: body,
    type: "PLAIN_TEXT"
  };
  return client
    .analyzeEntitySentiment({ document })
    .then(results => {
      const resp = new NLPEntityResponse();
      results[0].entities.forEach(element => {
        const entity = new NLPEntity(element);
        resp.entities.push(entity);
      });
      return resp;
    })
    .catch(err => {
      LOGGER.error("Failed to get NLP response, error: ", err);
      return new NLPEntityResponse();
    });
}

export { getNLPResponse };
