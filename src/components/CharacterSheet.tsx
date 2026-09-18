import { useState, useEffect, useCallback } from 'react';
import { Character } from '../types/character';
import { saveCharacter, exportCharacter } from '../utils/storage';
import { SheetPage1 } from './sheet/SheetPage1';
import { SheetPage2 } from './sheet/SheetPage2';
import { ru } from '../i18n';

interface Props {
  initial: Character;
  onBack: () => void;
}

type Tab = 'stats' | 'bio';

export function CharacterSheet({ initial, onBack }: Props) {
  const [char, setChar] = useState<Character>(initial);
  const [tab, setTab] = useState<Tab>('stats');
  const [saved, setSaved] = useState(true);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback((c: Character) => {
    saveCharacter(c);
    setSaved(true);
  }, []);

  const handleChange = useCallback((updates: Partial<Character>) => {
    setChar(prev => {
      const next = { ...prev, ...updates };
      setSaved(false);
      if (saveTimer) clearTimeout(saveTimer);
      const t = setTimeout(() => save(next), 600);
      setSaveTimer(t);
      return next;
    });
  }, [save, saveTimer]);

  useEffect(() => {
    const flush = () => save(char);
    window.addEventListener('beforeunload', flush);
    return () => window.removeEventListener('beforeunload', flush);
  }, [char, save]);

  useEffect(() => {
    return () => { if (saveTimer) clearTimeout(saveTimer); };
  }, [saveTimer]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c' }}>
      <div style={{
        borderBottom: '1px solid #2a2030',
        background: '#0d0d10',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'stretch',
        gap: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <button
          className="btn-ghost"
          style={{ margin: '10px 16px 10px 0', border: 'none', padding: '6px 10px', fontSize: '0.6rem' }}
          onClick={onBack}
        >
          {ru.backToLibrary}
        </button>

        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1, overflow: 'hidden' }}>
          <button className={`tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
            {ru.tabStats}
          </button>
          <button className={`tab-btn ${tab === 'bio' ? 'active' : ''}`} onClick={() => setTab('bio')}>
            {ru.tabBio}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.58rem',
            color: saved ? '#3a5a3a' : '#8b6000',
            transition: 'color 0.3s',
          }}>
            {saved ? ru.savedIndicator : ru.unsavedIndicator}
          </span>
          <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: '0.6rem' }}
            onClick={() => exportCharacter(char)}>
            {ru.exportJson}
          </button>
          <button className="btn-primary" style={{ padding: '5px 14px' }}
            onClick={() => save(char)}>
            {ru.saveBtn}
          </button>
        </div>
      </div>

      <div style={{
        background: '#0d0d10',
        borderBottom: '1px solid #1e1c28',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', fontWeight: 700, color: '#f0ece0' }}>
          {char.name || ru.unnamed}
        </div>
        {char.clan && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#8b0000' }}>
            {char.clan}
          </div>
        )}
        {char.predatorType && (
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a5660' }}>
            {char.predatorType}
          </div>
        )}
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#4a4460', marginLeft: 'auto' }}>
          {ru.gen} {char.generation} · {ru.hunger} {char.hunger} · {ru.humanity} {char.humanity}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {tab === 'stats' ? (
          <SheetPage1 char={char} onChange={handleChange} />
        ) : (
          <SheetPage2 char={char} onChange={handleChange} />
        )}
      </div>
    </div>
  );
}
