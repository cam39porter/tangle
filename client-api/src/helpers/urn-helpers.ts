const baseStr: string = "urn:hex";

function toUserUrn(id: string): string {
  return `${baseStr}:user:${id}`;
}

function toCaptureUrn(id: string): string {
  return `${baseStr}:capture:${id}`;
}

function toEntityUrn(userId: string, name: string, type: string): string {
  return `${baseStr}:entity:(${userId};${name};${type})`;
}

function toTagUrn(userId: string, name: string): string {
  return `${baseStr}:tag:(${userId};${name})`;
}

function toSessionUrn(id: string): string {
  return `${baseStr}:session:${id}`;
}

function toLinkUrn(userId: string, url: string): string {
  return `${baseStr}:link:${userId};${url}`;
}

function toEvernoteNoteUrn(
  userId: string,
  title: string,
  created: number
): string {
  return `${baseStr}:evernoteNote:(${userId};${title};${created.toString()})`;
}

function getUrnType(urn: string): string {
  return urn.split(":")[2];
}

export {
  toUserUrn,
  toCaptureUrn,
  toEntityUrn,
  toTagUrn,
  toSessionUrn,
  toLinkUrn,
  toEvernoteNoteUrn,
  getUrnType
};
