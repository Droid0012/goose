class CustomValidations {
  /**
   * Возвращает false, если строка содержит не латинские буквы
   * @param text проверяемая строка
   * @returns
   */
  isAnySymbolsExcludingNonLatinLetters(text: string) {
    // eslint-disable-next-line no-misleading-character-class, no-control-regex
    return /^([\u0000-\u007F\u0000-\u0040\u2000–\u2BFF\uFE00-\uFE1F]*)$/gm.test(text)
  }

  isOnlyLatinLettersAndNumbers(text: string) {
    return /^[a-zA-Z0-9]+$/gm.test(text)
  }
}

export const customValidations = new CustomValidations()
