import Delta from 'quill-delta';
import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { LANGUAGES } from '../services/getSpellingSuggestions';
import shouldHighlightWord from '../utils/shouldHighlightWord';
import PopUpMenu from './PopUpMenu';

function ItalianChecker() {
  const theme = 'bubble'
  const placeholder = 'Digit something in Italian here'

  const { quill, quillRef } = useQuill({theme, placeholder})

  const [popUpMenu, setPopUpMenu] = useState(false)
  const [spellingSuggestions, setSpellingSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState({
    selected: false,
    text: ''
  })
  const [selectionChange, setSelectionChange] = useState({
    index: 0,
    length: 0
  })

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldContents, source) => {
        if (source === 'user') {
          const isOnDelete = delta.ops.length === 2 && delta.ops[1].hasOwnProperty('delete')
          if (isOnDelete) {
            const selection = quill.getSelection()
            quill.removeFormat(selection.index, selection.length)
            } else {
            shouldHighlightWord(quill, source, LANGUAGES.ITALIAN)
            .then(data => {
              const [shouldHighlight, index, length, suggestions] = data
              if(shouldHighlight) {
                quill.formatText(index, length, 'underline', true)
                setSpellingSuggestions(currentSuggestions => [...currentSuggestions, suggestions])
              }
            })
          }
        }
      });
  }}, [quill]);

  useEffect(() => {
    if (quill) {
      quill.on('selection-change', function(range, oldRange, source) {
        if (range && range.length > 0 && quill.getFormat()['underline']) {
          setSelectionChange(range)
          setPopUpMenu(true)
        }
      })
    }
  }, [quill])

  useEffect(() => {
    if(selectedSuggestion.selected) {
      const retain = (selectionChange.index === 0) ? null : selectionChange.index
      const delta = new Delta().retain(retain).delete(selectionChange.length).insert(selectedSuggestion.text)
      quill.updateContents(delta)
      setSelectedSuggestion({
        selected: false,
        text: ''
      })
      setPopUpMenu(false)
    }
  }, [quill, selectionChange.index, selectionChange.length, selectedSuggestion.selected, selectedSuggestion.text])

  return (
    <div style={{ width: 500, height: 50, border: '2px solid green' }}>
      <div ref={quillRef} />
        {popUpMenu &&
          <PopUpMenu
            quill={quill}
            suggestionList={spellingSuggestions}
            setSelectedSuggestion={setSelectedSuggestion}
            setPopUpMenu={setPopUpMenu}
            selectionChange={selectionChange}
          />}
    </div>
  );
}

export default ItalianChecker;
