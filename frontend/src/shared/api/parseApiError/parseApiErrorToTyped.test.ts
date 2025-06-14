import { describe, expect, it } from 'vitest'

import { ApplicationError, type HTTPErrorCode } from 'src/shared/model/ApplicationError'
import { ValidationError } from 'src/shared/model/ValidationError'

import { parseApiErrorToTyped } from './parseApiErrorToTyped'

// Тип для тестовой формы
interface TestForm {
  name: string
  age: number
  profile: {
    email: string
  }
  address: {
    city: string
    zip: string
  }
}

describe('parseApiErrorToTyped', () => {
  // Тест на успешный парсинг ошибки валидации
  it('должен корректно парсить ошибку валидации', () => {
    const validationError = {
      error: 'INVALID_REQUEST',
      errorDetails: {
        code: 'INVALID_REQUEST',
        details: {
          context: {},
          data: [
            { field: 'name', error: 'name required' },
            { field: 'age', error: 'name required' },
          ],
        },
      },
    }

    const result = parseApiErrorToTyped<TestForm>(400, validationError)

    // Проверяем, что вернулся ValidationError
    expect(result).toBeInstanceOf(ValidationError)

    // Проверяем содержимое errors
    const validationResult = result as ValidationError<TestForm>
    expect(validationResult.errors).toEqual({
      name: 'name required',
      age: 'name required',
    })
  })

  // Тест на бизнес-ошибку со статусом 200
  it('должен корректно парсить бизнес-ошибку со статусом 200', () => {
    const businessError = {
      error: 'TASK_IS_NOT_FOUND',
      errorDetails: {
        code: 'TASK_IS_NOT_FOUND',
        details: {
          context: {},
          data: 'Задание не найдено',
        },
      },
    }

    const result = parseApiErrorToTyped<TestForm>(200 as HTTPErrorCode, businessError)

    // Проверяем, что вернулся ApplicationError
    expect(result).toBeInstanceOf(ApplicationError)

    // Проверяем message
    expect(result.message).toBe('TASK_IS_NOT_FOUND')
  })

  // Тест на вложенную ошибку поля (ValidationFieldError)
  it('должен корректно парсить вложенную ошибку поля', () => {
    const nestedError = {
      error: 'INVALID_REQUEST',
      errorDetails: {
        code: 'INVALID_REQUEST',
        details: {
          data: [
            {
              field: 'profile',
              error: {
                field: 'email',
                error: 'name required',
              },
            },
          ],
        },
      },
    }

    const result = parseApiErrorToTyped<TestForm>(400, nestedError)

    expect(result).toBeInstanceOf(ValidationError)
    const validationResult = result as ValidationError<TestForm>
    expect(validationResult.errors).toEqual({
      profile: {
        email: 'name required',
      },
    })
  })

  // Тест на вложенный массив ошибок (ValidationFieldError[])
  it('должен корректно парсить вложенный массив ошибок', () => {
    const arrayError = {
      error: 'INVALID_REQUEST',
      errorDetails: {
        code: 'INVALID_REQUEST',
        details: {
          data: [
            {
              field: 'address',
              error: [
                { field: 'city', error: 'name required' },
                { field: 'zip', error: 'name required' },
              ],
            },
          ],
        },
      },
    }

    const result = parseApiErrorToTyped<TestForm>(400, arrayError)

    expect(result).toBeInstanceOf(ValidationError)
    const validationResult = result as ValidationError<TestForm>
    expect(validationResult.errors).toEqual({
      address: {
        city: 'name required',
        zip: 'name required',
      },
    })
  })

  // Тест на парсинг системной ошибки без поля error
  it('должен корректно парсить системную ошибку без поля error', () => {
    const systemError = {
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'Failed to read request',
      instance: '/api/...',
    }

    const result = parseApiErrorToTyped<TestForm>(400, systemError)

    // Проверяем, что вернулся ApplicationError
    expect(result).toBeInstanceOf(ApplicationError)

    // Проверяем message (должен быть 'BAD_REQUEST' через маппинг httpCauseCode[400])
    expect(result.message).toBe('BAD_REQUEST')
  })

  // Тест на обработку некорректного тела ответа
  it('должен корректно обрабатывать некорректное тело ответа', () => {
    const invalidBody = 'некорректное тело'

    const result = parseApiErrorToTyped<TestForm>(500, invalidBody)

    // Проверяем, что вернулся ApplicationError
    expect(result).toBeInstanceOf(ApplicationError)

    // Проверяем message (должен быть 'INTERNAL_SERVER_ERROR' через маппинг httpCauseCode[500])
    expect(result.message).toBe('INTERNAL_SERVER_ERROR')
  })
})
