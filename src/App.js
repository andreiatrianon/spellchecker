import 'quill/dist/quill.bubble.css';
import { useEffect } from 'react';
import EnglishChecker from './components/EnglishChecker';
import FrenchChecker from './components/FrenchChecker';
import ItalianChecker from './components/ItalianChecker';

function App() {
  useEffect(() => {
    localStorage.setItem('dictionary', JSON.stringify([]))
  }, [])

  return (
    <div style={{ marginTop: 50, height: 600, display:'grid', justifyContent: 'center', alignContent: 'space-between' }}>
      <FrenchChecker />
      <ItalianChecker />
      <EnglishChecker />
    </div>
  );
}

export default App;
