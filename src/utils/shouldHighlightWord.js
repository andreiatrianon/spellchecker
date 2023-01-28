import getSpellingSuggestions from '../services/getSpellingSuggestions'

export const getCurrentWord = (currentContent) => {
  const wordsInArray = currentContent.split(/[.!?, 0-9]+/).filter(item => item !== '\n')
  return wordsInArray[wordsInArray.length - 1]
}

export default async function shouldHighlightWord(quill, source, lang) {
  if (source === 'user') {
    const currentContent = quill.getText()
    const currentChar = currentContent.charAt(quill.getLength() - 2)
    const shouldCheckSpell = currentChar === ' ' || currentChar === ','
    if (shouldCheckSpell) {
      const currentWord = getCurrentWord(currentContent)
      const dictionary = JSON.parse(localStorage.getItem('dictionary'))
      if (currentWord !== ' ' && currentWord !== ',' && !dictionary.includes(currentWord)) {
        const spellingSuggestions = await getSpellingSuggestions(currentWord, lang)
        const shouldHighlight = spellingSuggestions.length > 0
        if (shouldHighlight) {
          const indexOfCurrentWord = currentContent.lastIndexOf(currentWord)
          const currentWordLength = currentWord.length
          const suggestions = spellingSuggestions[0]
          return [shouldHighlight, indexOfCurrentWord, currentWordLength, suggestions]
        }
      }
    }
  }
  return [false, 0, 0, []]
}
