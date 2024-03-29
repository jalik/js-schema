/*
 * The MIT License (MIT)
 * Copyright (c) 2023 Karl STEIN
 */

import {
  ERROR_FIELD_ALLOWED,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_INVALID,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX,
  ERROR_FIELD_MAX_ITEMS,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MIN,
  ERROR_FIELD_MIN_ITEMS,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_MULTIPLE_OF,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNIQUE_ITEMS,
  ERROR_FIELD_UNKNOWN
} from '../errors'

const fr = {
  [ERROR_FIELD_ALLOWED]: 'Le champ doit contenir une valeur autorisée ({allowed}).',
  [ERROR_FIELD_DENIED]: 'Le champ contient une valeur interdite ({denied}).',
  [ERROR_FIELD_FORMAT]: 'Le champ ne correspond pas au format attendu ({format}).',
  [ERROR_FIELD_INVALID]: 'Le champ n\'est pas valide.',
  [ERROR_FIELD_LENGTH]: 'Le champ doit avoir une taille égale à {length}.',
  [ERROR_FIELD_MAX]: 'Le champ doit être inférieur ou égal à {max}.',
  [ERROR_FIELD_MAX_ITEMS]: 'Le champ doit contenir au plus {maxItems} éléments.',
  [ERROR_FIELD_MAX_LENGTH]: 'Le champ doit avoir une taille inférieure ou égale à {maxLength}.',
  [ERROR_FIELD_MAX_WORDS]: 'Le champ doit comporter au plus {maxWords} mots.',
  [ERROR_FIELD_MIN]: 'Le champ doit être supérieur ou égal à {min}.',
  [ERROR_FIELD_MIN_ITEMS]: 'Le champ doit contenir au moins {minItems} éléments.',
  [ERROR_FIELD_MIN_LENGTH]: 'Le champ doit avoir une taille supérieure ou égale à {minLength}.',
  [ERROR_FIELD_MIN_WORDS]: 'Le champ doit comporter au moins {minWords} mots.',
  [ERROR_FIELD_MULTIPLE_OF]: 'Le champ doit être un multiple de {multipleOf}.',
  [ERROR_FIELD_PATTERN]: 'Le champ ne correspond pas au motif "{pattern}".',
  [ERROR_FIELD_REQUIRED]: 'Le champ est obligatoire.',
  [ERROR_FIELD_TYPE]: 'Le type du champ n\'est pas valide.',
  [ERROR_FIELD_UNIQUE_ITEMS]: 'Le champ doit contenir des valeurs uniques.',
  [ERROR_FIELD_UNKNOWN]: 'Le champ est inconnu.'
}

export default fr
