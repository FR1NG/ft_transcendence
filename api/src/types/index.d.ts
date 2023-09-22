export type StringPair = {
  [key: string]: string,
}

export type AuthenticatedUser = {
  sub: string,
  username: string,
  isOtpActivated: boolean
  isOtpVirified: boolean
}
