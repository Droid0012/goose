import { describe, expect, it } from 'vitest'

import { handleNestedError } from './handleNestedError'

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

describe('handleNestedError', () => {
  it('должен обрабатывать простую строковую ошибку', () => {
    const result = handleNestedError<TestForm>({}, 'name', 'name required')

    expect(result).toEqual({
      name: 'name required',
    })
  })

  // it('должен обрабатывать массив ошибок', () => {
  //   const result = handleNestedError<TestForm>({}, 'profile', [
  //     { field: 'firstName', error: 'firstName required' },
  //     { field: 'lastName', error: 'surName required' },
  //   ])

  //   expect(result).toEqual({
  //     profile: {
  //       firstName: 'firstName required',
  //       lastName: 'surName required',
  //     },
  //   })
  // })

  it('должен обрабатывать рекурсивную вложенность', () => {
    const result = handleNestedError<TestForm>({}, 'profile', {
      field: 'firstName',
      error: {
        field: 'length',
        error: 'name required',
      },
    })

    expect(result).toEqual({
      profile: {
        firstName: {
          length: 'name required',
        },
      },
    })
  })

  it('должен обрабатывать смешанную вложенность', () => {
    const result = handleNestedError<TestForm>({}, 'addresses', [
      {
        field: '0',
        error: {
          field: 'city',
          error: 'name required',
        },
      },
      {
        field: '1',
        error: {
          field: 'street',
          error: 'name required',
        },
      },
    ])

    expect(result).toEqual({
      addresses: {
        0: {
          city: 'name required',
        },
        1: {
          street: 'name required',
        },
      },
    })
  })
})
