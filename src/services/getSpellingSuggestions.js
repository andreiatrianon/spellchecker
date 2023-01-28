export const LANGUAGES = {
  FRENCH: 'fr',
  ITALIAN: 'it',
  ENGLISH: 'en',
}

export default function getSpellingSuggestions(text, lang) {
  const formData = new FormData()
  formData.append('text', text)
  formData.append('lang', lang)

  return fetch('http://localhost:8000/server.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => data)
}
