export class ApplicationError<T extends string = string> extends Error {
  readonly type: T;

  constructor(type: T, message: string) {
    super(message);
    this.type = type;
  }
}
