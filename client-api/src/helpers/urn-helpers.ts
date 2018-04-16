const baseStr: string = "urn:hex";

function toUserUrn(id: string) {
  return `${baseStr}:user:${id}`;
}

function toCaptureUrn(id: string) {
  return `${baseStr}:capture:${id}`;
}

function toEntityUrn(id: string) {
  return `${baseStr}:entity:${id}`;
}

function toTagUrn(id: string) {
  return `${baseStr}:tag:${id}`;
}

export { toUserUrn, toCaptureUrn, toEntityUrn, toTagUrn };
