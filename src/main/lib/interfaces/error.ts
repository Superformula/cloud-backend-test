export interface IDevError {
  path: ReadonlyArray<string | number>
  code: string
  message: string
  stack: string
}

export interface IUserError {
  code: string
  path: ReadonlyArray<string | number>
  message: string
}
