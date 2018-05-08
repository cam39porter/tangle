import { StatementResult } from "neo4j-driver/types/v1";
import { EvernoteUpload } from "../../upload/models/evernote-upload";
import { ConflictError } from "../../util/exceptions/confict-error";
import { executeQuery } from "../db";
import { EvernoteNote } from "../models/evernote-note";

export function get(userId: string, noteId: string): Promise<EvernoteNote> {
  const params = { userId, noteId };
  const query = `
    MATCH (u:User {id:{userId}})-[:CREATED]->(note:EvernoteNote {id:{noteId}})
    RETURN note`;
  return executeQuery(query, params).then(formatNote);
}
export function createIfAbsent(
  userId: string,
  upload: EvernoteUpload
): Promise<EvernoteNote> {
  return get(userId, upload.id).then(note => {
    if (note !== null) {
      throw new ConflictError("Record already exists in the db");
    } else {
      const params = {
        userId,
        noteId: upload.id,
        created: upload.created,
        lastModified: upload.lastModified,
        title: upload.title
      };
      const query = `
        MATCH (u:User {id:{userId}})
        CREATE (note:EvernoteNote {
          id:{noteId},
          created:{created},
          lastModified:{lastModified},
          title:{title},
          owner:{userId}
        })<-[:CREATED]-(u)
        RETURN note`;
      return executeQuery(query, params).then(formatNote);
    }
  });
}

function formatNote(result: StatementResult): EvernoteNote {
  if (!result.records[0] || !result.records[0].get("note")) {
    return null;
  }
  return result.records[0].get("note").properties as EvernoteNote;
}
