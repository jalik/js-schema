/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

class InvalidPathError extends Error {
  public readonly path: string

  constructor (path: string) {
    super(`The path "${path}" is not valid.`)
    Object.setPrototypeOf(this, InvalidPathError.prototype)
    this.path = path
  }
}

export default InvalidPathError
