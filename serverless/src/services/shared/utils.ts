export class JSONParseError extends Error {
  constructor(message: string) {
    super(`JSON.parse Error: ${message}`);
  }
}

export function parseJSON(arg: string): any {
  try {
    return JSON.parse(arg);
  } catch (error: any) {
    throw new JSONParseError(error.message);
  }
}