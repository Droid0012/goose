// Позволяет сохранять в JSON и парсить Map-ы и Set-у

export function extendedJSONReplacer(_: unknown, value: unknown) {
  if (value instanceof Map) {
    return {
      __EJR_dataType__: 'Map',
      value: Array.from(value.entries()),
    }
  } else if (value instanceof Set) {
    return {
      __EJR_dataType__: 'Set',
      value: Array.from(value),
    }
  } else {
    return value
  }
}

export function extendedJSONReviver(_: unknown, value: unknown) {
  if (typeof value === 'object' && value) {
    if ('__EJR_dataType__' in value && 'value' in value) {
      if (value.__EJR_dataType__ === 'Map') {
        return new Map(value.value as [unknown, unknown][])
      } else if (value.__EJR_dataType__ === 'Set') {
        return new Set(value.value as unknown[])
      }
    }
  }

  return value
}
