/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ERROR_FIELD_ALLOWED } from '../errors/FieldAllowedError';
import { ERROR_FIELD_DENIED } from '../errors/FieldDeniedError';
import { ERROR_FIELD_INVALID } from '../errors/FieldError';
import { ERROR_FIELD_INSTANCE } from '../errors/FieldInstanceError';
import { ERROR_FIELD_LENGTH } from '../errors/FieldLengthError';
import { ERROR_FIELD_MAX } from '../errors/FieldMaxError';
import { ERROR_FIELD_MAX_LENGTH } from '../errors/FieldMaxLengthError';
import { ERROR_FIELD_MAX_WORDS } from '../errors/FieldMaxWordsError';
import { ERROR_FIELD_MIN } from '../errors/FieldMinError';
import { ERROR_FIELD_MIN_LENGTH } from '../errors/FieldMinLengthError';
import { ERROR_FIELD_MIN_WORDS } from '../errors/FieldMinWordsError';
import { ERROR_FIELD_NULLABLE } from '../errors/FieldNullableError';
import { ERROR_FIELD_PATTERN } from '../errors/FieldPatternError';
import { ERROR_FIELD_REQUIRED } from '../errors/FieldRequiredError';
import { ERROR_FIELD_TYPE } from '../errors/FieldTypeError';
import { ERROR_FIELD_UNKNOWN } from '../errors/FieldUnknownError';

const fr = {
  [ERROR_FIELD_ALLOWED]: '"{field}" contient une valeur qui n\'est pas autorisée ({allowed}).',
  [ERROR_FIELD_DENIED]: '"{field}" contient une valeur qui est interdite ({denied}).',
  [ERROR_FIELD_INSTANCE]: '"{field}" contient une valeur qui est une instance invalide.',
  [ERROR_FIELD_INVALID]: '"{field}" n\'est pas valide.',
  [ERROR_FIELD_LENGTH]: '"{field}" doit avoir une taille égale à {length}.',
  [ERROR_FIELD_MAX]: '"{field}" doit être inférieur ou égal à {max}.',
  [ERROR_FIELD_MAX_LENGTH]: '"{field}" doit avoir une taille inférieure ou égale à {maxLength}.',
  [ERROR_FIELD_MAX_WORDS]: '"{field}" doit comporter au plus {maxWords} mots.',
  [ERROR_FIELD_MIN]: '"{field}" doit être supérieur ou égal à {min}.',
  [ERROR_FIELD_MIN_LENGTH]: '"{field}" doit avoir une taille supérieure ou égale à {minLength}.',
  [ERROR_FIELD_MIN_WORDS]: '"{field}" doit comporter au moins {minWords} mots.',
  [ERROR_FIELD_NULLABLE]: '"{field}" ne peut pas être null.',
  [ERROR_FIELD_PATTERN]: '"{field}" ne correspond pas au motif "{pattern}".',
  [ERROR_FIELD_REQUIRED]: '"{field}" est obligatoire.',
  [ERROR_FIELD_TYPE]: '"{field}" n\'est pas du type "{type}".',
  [ERROR_FIELD_UNKNOWN]: '"{field}" est inconnu.',
};

export default fr;
