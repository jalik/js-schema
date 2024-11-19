/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

class FieldResolutionError extends Error {
  public path: string

  constructor (path: string) {
    super(`The field "${path}" cannot be resolved.`)
    Object.setPrototypeOf(this, FieldResolutionError.prototype)
    this.path = path
  }
}

export default FieldResolutionError
