import { MalformedUrnError } from "../../util/exceptions/malformed-urn-error";
import { UnsupportedUrnError } from "../../util/exceptions/unsupported-urn-error";
import { UserUrn } from "../../urn/user-urn";

const baseStr: string = "urn:hex";

function toUserUrn(id: string): string {
  return `${baseStr}:user:${id}`;
}

function toEntityUrn(userId: UserUrn, name: string, type: string): string {
  return `${baseStr}:entity:(${userId.toRaw()};${name};${type})`;
}

function toTagUrn(userId: UserUrn, name: string): string {
  return `${baseStr}:tag:(${userId.toRaw()};${name})`;
}

function toSessionUrn(id: string): string {
  return `${baseStr}:session:${id}`;
}

function toLinkUrn(userId: UserUrn, url: string): string {
  return `${baseStr}:link:${userId.toRaw()};${url}`;
}

function toEvernoteNoteUrn(
  userId: UserUrn,
  title: string,
  created: number
): string {
  return `${baseStr}:evernoteNote:(${userId.toRaw()};${title};${created.toString()})`;
}

function getUrnType(urn: string): string {
  const type = urn.split(":")[2];
  if (!type) {
    throw new MalformedUrnError(`${urn} is malformed`);
  }
  return type;
}

function getLabel(urn: string): string {
  const urnType = getUrnType(urn);
  const label = urnTypeToLabel[getUrnType(urn)];
  if (!label) {
    throw new UnsupportedUrnError(`${urnType} is not supported`);
  }
  return label;
}

const urnTypeToLabel = {
  capture: "Capture",
  link: "Link",
  session: "Session",
  user: "User",
  tag: "Tag",
  entity: "Entity",
  evernoteNote: "EvernoteNote"
};

export {
  toUserUrn,
  toEntityUrn,
  toTagUrn,
  toSessionUrn,
  toLinkUrn,
  toEvernoteNoteUrn,
  getUrnType,
  getLabel
};
