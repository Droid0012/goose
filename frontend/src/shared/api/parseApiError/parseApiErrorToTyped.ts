import {
  ApplicationError,
  type HTTPErrorCode,
  type HttpErrorCause,
  httpCauseCode,
} from 'src/shared/model/ApplicationError'
import { ValidationError, type ValidationErrorsType } from 'src/shared/model/ValidationError'

import { type ValidationFieldError, handleNestedError } from './handleNestedError'

/**
 * Парсит ответ от API в ApplicationError или ValidationError<TForm>
 * @param status - HTTP статус код
 * @param body - тело ответа
 * @returns ApplicationError или ValidationError
 */
export function parseApiErrorToTyped<TForm extends object = object, E extends string = string>(
  status: HTTPErrorCode,
  body: unknown,
): ApplicationError<E> | ValidationError<TForm> {
  // Проверяем, что тело ошибки соответствует ожидаемой структуре от API:
  // - должно быть объектом
  // - не должно быть null
  // - должно содержать поле "error"
  // Если это не так — ошибка системная или неожидаемая, возвращаем ApplicationError по статусу
  if (typeof body !== 'object' || body === null || !('error' in body)) {
    return new ApplicationError<E>(httpCauseCode[status])
  }

  const raw = body as {
    error: string
    errorDetails?: {
      code: string
      details: {
        context?: unknown
        data?: unknown
      }
    }
  }

  const cause = raw.error
  const details = raw.errorDetails?.details

  // Проверка на ошибку валидации
  const isValidationError = cause === 'INVALID_REQUEST' && status === 400

  if (isValidationError && Array.isArray(details?.data)) {
    let validationErrors = {} as ValidationErrorsType<TForm>

    // Обработка ошибок валидации
    for (const item of details.data as ValidationFieldError[]) {
      if (item.field) {
        validationErrors = handleNestedError(validationErrors, item.field, item.error)
      }
    }

    return new ValidationError(validationErrors)
  }

  return new ApplicationError<E>(cause as HttpErrorCause)
}
