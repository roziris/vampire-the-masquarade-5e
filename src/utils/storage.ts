import { Character } from '../types/character';

const PREFIX = 'v5_character_';
const INDEX_KEY = 'v5_character_index';

function getIndex(): string[] {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  } catch {
    return [];
  }
}

function setIndex(ids: string[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}

export function saveCharacter(char: Character): void {
  char.updatedAt = new Date().toISOString();
  localStorage.setItem(PREFIX + char.id, JSON.stringify(char));
  const idx = getIndex();
  if (!idx.includes(char.id)) {
    setIndex([char.id, ...idx]);
  }
}

export function loadCharacter(id: string): Character | null {
  try {
    const raw = localStorage.getItem(PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadAllCharacters(): Character[] {
  return getIndex()
    .map(loadCharacter)
    .filter(Boolean) as Character[];
}

export function deleteCharacter(id: string): void {
  localStorage.removeItem(PREFIX + id);
  setIndex(getIndex().filter(i => i !== id));
}

export function duplicateCharacter(char: Character): Character {
  const dup: Character = {
    ...JSON.parse(JSON.stringify(char)),
    id: crypto.randomUUID(),
    name: char.name + ' (Copy)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCharacter(dup);
  return dup;
}

export function exportCharacter(char: Character): void {
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${char.name.replace(/\s+/g, '_')}_V5.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCharacter(file: File): Promise<Character> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const char = JSON.parse(e.target?.result as string) as Character;
        if (!char.id || !char.name) throw new Error('Invalid character file');
        char.id = crypto.randomUUID();
        char.updatedAt = new Date().toISOString();
        saveCharacter(char);
        resolve(char);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
