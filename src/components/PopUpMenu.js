import HighlightOff from '@mui/icons-material/HighlightOff';
import NoteAdd from '@mui/icons-material/NoteAdd';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentWord } from '../utils/shouldHighlightWord';

export default function PopUpMenu({quill, suggestionList, setSelectedSuggestion, setPopUpMenu, selectionChange}){
  const [suggestionListForSelectedWord, setSuggestionListForSelectedWord] = useState([])

  useEffect(() => {
    const selectedWord = quill.getText().substr(selectionChange.index, selectionChange.length)
    setSuggestionListForSelectedWord(suggestionList.find(suggestion => suggestion.original === selectedWord)['suggestions'])
  }, [quill, selectionChange,suggestionList])

  const handleSuggestionClick = useCallback((e, suggestiion) => {
    e.preventDefault()
    setSelectedSuggestion({selected: true, text: suggestiion})
  }, [setSelectedSuggestion])

  const handleAddToDictionaryClick = useCallback(e => {
    e.preventDefault()
    const currentWord = getCurrentWord(quill.getText())
    const dictionary = JSON.parse(localStorage.getItem('dictionary'))
    localStorage.setItem('dictionary', JSON.stringify([...dictionary, currentWord]))
    setSelectedSuggestion({selected: true, text: currentWord})
  }, [quill, setSelectedSuggestion])

  const handleIgnoreClick = useCallback(e => {
    e.preventDefault()
    setPopUpMenu(false)
  }, [setPopUpMenu])

  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
      {suggestionListForSelectedWord.map((suggestion, index) => (
        <MenuItem key={`suggestion-${index}`} onClick={e => handleSuggestionClick(e, suggestion)}>
          <ListItemText>{suggestion}</ListItemText>
        </MenuItem>
      ))}
        <Divider />
        <MenuItem onClick={handleAddToDictionaryClick}>
          <ListItemIcon>
            <NoteAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add To Dictionay</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleIgnoreClick}>
          <ListItemIcon>
            <HighlightOff fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ignore</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
