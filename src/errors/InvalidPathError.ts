/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

class InvalidPathError extends Error {
  constructor (path: string) {
    super(`The path "${path}" is not valid.`)
    Object.setPrototypeOf(this, InvalidPathError.prototype)
  }
}

export default InvalidPathError
