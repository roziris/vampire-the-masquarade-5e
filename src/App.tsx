import { useState, useEffect } from 'react';
import { Character, createBlankCharacter } from './types/character';
import { loadAllCharacters, saveCharacter } from './utils/storage';
import { Library } from './components/Library';
import { CharacterSheet } from './components/CharacterSheet';

type View = { mode: 'library' } | { mode: 'sheet'; character: Character };

export default function App() {
  const [view, setView] = useState<View>({ mode: 'library' });
  const [characters, setCharacters] = useState<Character[]>([]);

  const refresh = () => setCharacters(loadAllCharacters());

  useEffect(() => { refresh(); }, []);

  const openCharacter = (id: string) => {
    const chars = loadAllCharacters();
    const char = chars.find(c => c.id === id);
    if (char) setView({ mode: 'sheet', character: char });
  };

  const newCharacter = () => {
    const char = createBlankCharacter();
    saveCharacter(char);
    refresh();
    setView({ mode: 'sheet', character: char });
  };

  const goToLibrary = () => {
    refresh();
    setView({ mode: 'library' });
  };

  if (view.mode === 'sheet') {
    return (
      <CharacterSheet
        initial={view.character}
        onBack={goToLibrary}
      />
    );
  }

  return (
    <Library
      characters={characters}
      onOpen={openCharacter}
      onNew={newCharacter}
      onRefresh={refresh}
    />
  );
}
