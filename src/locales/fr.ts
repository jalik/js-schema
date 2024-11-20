/*
 * The MIT License (MIT)
 * Copyright (c) 2024 Karl STEIN
 */

import {
  ERROR_FIELD_ADDITIONAL_PROPERTIES,
  ERROR_FIELD_DENIED,
  ERROR_FIELD_ENUM,
  ERROR_FIELD_EXCLUSIVE_MAXIMUM,
  ERROR_FIELD_EXCLUSIVE_MINIMUM,
  ERROR_FIELD_FORMAT,
  ERROR_FIELD_LENGTH,
  ERROR_FIELD_MAX_ITEMS,
  ERROR_FIELD_MAX_LENGTH,
  ERROR_FIELD_MAX_WORDS,
  ERROR_FIELD_MAXIMUM,
  ERROR_FIELD_MIN_ITEMS,
  ERROR_FIELD_MIN_LENGTH,
  ERROR_FIELD_MIN_WORDS,
  ERROR_FIELD_MINIMUM,
  ERROR_FIELD_MULTIPLE_OF,
  ERROR_FIELD_PATTERN,
  ERROR_FIELD_PATTERN_PROPERTIES,
  ERROR_FIELD_PROPERTIES,
  ERROR_FIELD_REQUIRED,
  ERROR_FIELD_TYPE,
  ERROR_FIELD_UNIQUE_ITEMS,
  ERROR_SCHEMA_VALIDATION
} from '../errors'
import { LocaleData } from '../locale'

const fr: LocaleData = {
  [ERROR_FIELD_ADDITIONAL_PROPERTIES]: 'Le champ n\'est pas autorisé.',
  [ERROR_FIELD_DENIED]: 'Le champ contient une valeur interdite.',
  [ERROR_FIELD_ENUM]: 'Le champ doit contenir des valeurs "{allowed}".',
  [ERROR_FIELD_EXCLUSIVE_MAXIMUM]: 'Le champ doit être inférieur à {exclusiveMaximum}.',
  [ERROR_FIELD_EXCLUSIVE_MINIMUM]: 'Le champ doit être supérieur à {exclusiveMinimum}',
  [ERROR_FIELD_FORMAT]: 'Le champ ne correspond pas au format attendu ({format}).',
  [ERROR_FIELD_LENGTH]: 'Le champ doit avoir une taille égale à {length}.',
  [ERROR_FIELD_MAXIMUM]: 'Le champ doit être inférieur ou égal à {maximum}.',
  [ERROR_FIELD_MAX_ITEMS]: 'Le champ doit contenir au plus {maxItems} éléments.',
  [ERROR_FIELD_MAX_LENGTH]: 'Le champ doit avoir une taille inférieure ou égale à {maxLength}.',
  [ERROR_FIELD_MAX_WORDS]: 'Le champ doit comporter au plus {maxWords} mots.',
  [ERROR_FIELD_MINIMUM]: 'Le champ doit être supérieur ou égal à {minimum}.',
  [ERROR_FIELD_MIN_ITEMS]: 'Le champ doit contenir au moins {minItems} éléments.',
  [ERROR_FIELD_MIN_LENGTH]: 'Le champ doit avoir une taille supérieure ou égale à {minLength}.',
  [ERROR_FIELD_MIN_WORDS]: 'Le champ doit comporter au moins {minWords} mots.',
  [ERROR_FIELD_MULTIPLE_OF]: 'Le champ doit être un multiple de {multipleOf}.',
  [ERROR_FIELD_PATTERN]: 'Le champ ne correspond pas au motif "{pattern}".',
  [ERROR_FIELD_PATTERN_PROPERTIES]: 'Le champ contient des noms de propriété invalides "{patternProperties}".',
  [ERROR_FIELD_PROPERTIES]: 'Le champ doit être un objet.',
  [ERROR_FIELD_REQUIRED]: 'Le champ est obligatoire.',
  [ERROR_FIELD_TYPE]: 'Le type du champ n\'est pas valide.',
  [ERROR_FIELD_UNIQUE_ITEMS]: 'Le champ doit contenir des valeurs uniques.',
  [ERROR_SCHEMA_VALIDATION]: 'La validation a échouée.'
}

export default fr
