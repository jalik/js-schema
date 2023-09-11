/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

class FieldResolutionError extends Error {
  public path: string

  constructor (path: string) {
    super(`Cannot resolve "${path}".`)
    this.path = path
  }
}

export default FieldResolutionError
