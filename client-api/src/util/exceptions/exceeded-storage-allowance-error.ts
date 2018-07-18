export class ExceededStorageAllowanceError extends Error {
  constructor(m: string) {
    super(m);
  }
}
