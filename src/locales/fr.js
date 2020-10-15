/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Karl STEIN
 */

import {
  ERROR_FIELD_ALLOWED,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_INVALID,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MIN,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_NULLABLE,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNKNOWN,
} from '../errors';

const fr = {
  [ERROR_FIELD_ALLOWED]: '"{field}" contient une valeur qui n\'est pas autorisée ({allowed}).',
  [ERROR_FIELD_DENIED]: '"{field}" contient une valeur qui est interdite ({denied}).',
  [ERROR_FIELD_FORMAT]: '"{field}" ne correspond pas au format attendu ({format}).',
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
