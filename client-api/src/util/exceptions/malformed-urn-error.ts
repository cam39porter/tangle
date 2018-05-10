export class MalformedUrnError extends Error {
  constructor(m: string) {
    super(m);
  }
}
