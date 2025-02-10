import { SpaceEntry } from "../model/spaceModel";

export class MissingFieldError extends Error {
  constructor(public field: string) {
    super(`Missing field: ${field}`);
  }
}

export function validateAsSpaceEntry(maybe: SpaceEntry): maybe is SpaceEntry {
  if (maybe.id === undefined) {
    throw new MissingFieldError('id');
  }
  if (maybe.location === undefined) {
    throw new MissingFieldError('location');
  }
  if (maybe.name === undefined) {
    throw new MissingFieldError('name');
  }
  return true;
}