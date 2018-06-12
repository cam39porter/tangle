import { MalformedUrnError } from "../../util/exceptions/malformed-urn-error";
import { UnsupportedUrnError } from "../../util/exceptions/unsupported-urn-error";
import { UserUrn } from "../../urn/user-urn";

const baseStr: string = "urn:hex";

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

export { toEvernoteNoteUrn, getUrnType, getLabel };
