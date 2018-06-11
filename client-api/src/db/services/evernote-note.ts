import { StatementResult } from "neo4j-driver/types/v1";
import { EvernoteUpload } from "../../upload/models/evernote-upload";
import { executeQuery } from "../db";
import { EvernoteNote } from "../models/evernote-note";
import { UserUrn } from "../../urn/user-urn";

export function get(userId: UserUrn, noteId: string): Promise<EvernoteNote> {
  const params = {
    userId: userId.toRaw(),
    noteId
  };
  const query = `
    MATCH (u:User {id:{userId}})-[:CREATED]->(note:EvernoteNote {id:{noteId}})
    RETURN note`;
  return executeQuery(query, params).then(formatNote);
}

export function create(
  userId: UserUrn,
  upload: EvernoteUpload
): Promise<EvernoteNote> {
  const params = {
    userId: userId.toRaw(),
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

export function deleteNote(userId: UserUrn, evernoteId: string): Promise<void> {
  const params = { userId: userId.toRaw(), evernoteId };
  const query = `
    MATCH (u:User {id:{userId}})-[:CREATED]->(note:EvernoteNote {id:{evernoteId}})
    DETACH DELETE note
  `;
  return executeQuery(query, params).then(() => null);
}

function formatNote(result: StatementResult): EvernoteNote {
  if (!result.records[0] || !result.records[0].get("note")) {
    return null;
  }
  return result.records[0].get("note").properties as EvernoteNote;
}
