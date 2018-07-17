import * as kue from "kue";
import { create } from "../../db/services/session";
import { EvernoteUpload } from "../models/evernote-upload";
import { parseEvernoteHtml } from "./evernote-html-parser";
import { UserUrn } from "../../urn/user-urn";
import { Logger } from "../../util/logging/logger";
import { updateCaptures } from "../../chunk/services/chunk";
import { SessionUrn } from "../../urn/session-urn";
import { getFile } from "./file-db";

const LOGGER = new Logger("src/upload/services/queue.ts");

const queue = kue.createQueue();
queue.process("parse upload", (job, done) => {
  LOGGER.info(
    `processing upload for user ${job.data.userUrn} with id ${
      job.data.sessionUrn
    }...`
  );

  parseAndCreateNote(
    UserUrn.fromRaw(job.data.userUrn),
    SessionUrn.fromRaw(job.data.sessionUrn)
  )
    .then(() => {
      LOGGER.info(
        `completed upload for user ${job.data.userUrn} with id ${
          job.data.sessionUrn
        }`
      );
      done();
    })
    .catch(err => {
      LOGGER.error(
        `Failed upload for user ${job.data.userUrn} with id ${
          job.data.sessionUrn
        }`
      );
      LOGGER.error(err);
      done(err);
    });
});

export function enqueue(userUrn: UserUrn, sessionUrn: SessionUrn): kue.Job {
  return queue
    .create("parse upload", {
      userUrn: userUrn.toRaw(),
      sessionUrn: sessionUrn.toRaw()
    })
    .ttl(60000)
    .attempts(3)
    .backoff({ type: "exponential" })
    .on("failed attempt", errorMessage => {
      LOGGER.warn("Failed attempt", errorMessage);
    })
    .on("failed", errorMessage => {
      LOGGER.error("Failed", errorMessage);
    })
    .save(err => {
      if (err) {
        LOGGER.error(err);
      }
    });
}

function parseAndCreateNote(
  userUrn: UserUrn,
  sessionUrn: SessionUrn
): Promise<void> {
  let note: EvernoteUpload = null;
  return new Promise((resolve, reject) => {
    const fileStream = getFile(userUrn, sessionUrn);
    let all;
    fileStream.on("data", chunk => {
      if (all) {
        all = all + chunk;
      } else {
        all = chunk;
      }
    });
    fileStream.on("end", () => {
      try {
        note = parseEvernoteHtml(all);
        resolve(createEvernoteNote(userUrn, sessionUrn, note));
      } catch (err) {
        LOGGER.error(err);
        reject(err);
      }
    });
    fileStream.on("error", err => {
      LOGGER.error(err);
      reject(err);
    });
  });
}

function createEvernoteNote(
  userId: UserUrn,
  noteUrn: SessionUrn,
  note: EvernoteUpload
): Promise<void> {
  return create(
    noteUrn,
    userId,
    note.title,
    note.body,
    note.created,
    true
  ).then(() => {
    return updateCaptures(noteUrn, note.body, note.created).then(() => null);
  });
}
