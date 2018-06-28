export class NotWhitelistedError extends Error {
  constructor(m: string) {
    super(m);
  }
}
