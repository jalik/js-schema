/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import { ERROR_FIELD_DENIED } from '../errors';
import FieldError from './FieldError';

class FieldDeniedError extends FieldError {
  public denied: any[];

  constructor(field: string, denied: any[], path: string) {
    super(field, path, ERROR_FIELD_DENIED);
    this.denied = denied;
    this.message = `The field contains a denied value (${denied}).`;
  }
}

export default FieldDeniedError;
