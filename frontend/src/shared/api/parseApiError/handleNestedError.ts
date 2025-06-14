import type { ValidationErrorKey } from 'src/shared/config/types/validationErrors'
import type { ValidationErrorsType } from 'src/shared/model/ValidationError'

/**
 * Ошибка валидации с рекурсивной вложенностью:
 * - строка — обычная ошибка поля
 * - один объект — вложенное поле
 * - массив — список вложенных полей
 */
export interface ValidationFieldError {
  field: string
  error: ValidationErrorKey | ValidationFieldError | ValidationFieldError[]
}

/**
 * Обрабатывает вложенную ошибку валидации, создавая новый объект
 * @param target - исходный объект
 * @param field - имя поля для вложенности
 * @param error - ошибка валидации
 * @returns Новый объект с обработанными ошибками
 */
export function handleNestedError<TForm extends object>(
  target: ValidationErrorsType<TForm>,
  field: string,
  error: ValidationErrorKey | ValidationFieldError | ValidationFieldError[],
): ValidationErrorsType<TForm> {
  let newTarget = { ...target }

  if (typeof error === 'string') {
    // Простая ошибка - устанавливаем напрямую
    newTarget = {
      ...newTarget,
      [field]: error,
    }
  } else if (Array.isArray(error)) {
    // Обработка массива ошибок
    const nestedErrors = error.reduce((acc, nested) => {
      if (nested.field && nested.error !== undefined) {
        const processedError = handleNestedError({}, nested.field, nested.error)
        return {
          ...acc,
          ...processedError,
        }
      }
      return acc
    }, {})

    newTarget = {
      ...newTarget,
      [field]: nestedErrors,
    }
  } else if (typeof error === 'object' && 'field' in error && 'error' in error) {
    // Рекурсивная обработка вложенной ошибки
    const nestedError = handleNestedError({}, error.field, error.error)
    newTarget = {
      ...newTarget,
      [field]: nestedError,
    }
  }

  return newTarget
}
