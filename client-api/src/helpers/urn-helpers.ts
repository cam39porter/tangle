const baseStr: string = "urn:hex";

function toUserUrn(id: string): string {
  return `${baseStr}:user:${id}`;
}

function toCaptureUrn(id: string): string {
  return `${baseStr}:capture:${id}`;
}

function toEntityUrn(id: string): string {
  return `${baseStr}:entity:${id}`;
}

function toTagUrn(id: string): string {
  return `${baseStr}:tag:${id}`;
}

function getUrnType(urn: string): string {
  return urn.split(":")[2];
}

export { toUserUrn, toCaptureUrn, toEntityUrn, toTagUrn, getUrnType };
