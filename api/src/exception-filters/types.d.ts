import { StringPair } from "src/types"

export type ErrorStatusCodes = {
  [key: string]: number
}

export type ErrorMessageMapping = {
  [key: string]: {error: string, message: string};
}; 
