import { useRef } from 'react';
import { Character } from '../types/character';
import { deleteCharacter, duplicateCharacter, exportCharacter, importCharacter } from '../utils/storage';
import { Account } from '../utils/auth';
import { ru } from '../i18n';

interface LibraryProps {
  account: Account | null;
  characters: Character[];
  onOpen: (id: string) => void;
  onNew: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return '—'; }
}

function ClanGlyph({ clan }: { clan: string }) {
  const initials = clan ? clan.slice(0, 2).toUpperCase() : '??';
  return (
    <div style={{
      width: 52, height: 52,
      background: '#1a0a0e',
      border: '1px solid #3a1020',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', color: '#8b0000', fontWeight: 700 }}>
        {initials}
      </span>
    </div>
  );
}

export function Library({ account, characters, onOpen, onNew, onRefresh, onLogout }: LibraryProps) {
  const importRef = useRef<HTMLInputElement>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm(ru.confirmDelete)) {
      deleteCharacter(id);
      onRefresh();
    }
  };

  const handleDuplicate = (e: React.MouseEvent, char: Character) => {
    e.stopPropagation();
    duplicateCharacter(char);
    onRefresh();
  };

  const handleExport = (e: React.MouseEvent, char: Character) => {
    e.stopPropagation();
    exportCharacter(char);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importCharacter(file);
      onRefresh();
    } catch {
      alert(ru.importError);
    }
    e.target.value = '';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', padding: '0 0 60px 0' }}>
      <div style={{
        borderBottom: '1px solid #2a2030',
        padding: '28px 32px 24px',
        background: '#0d0d10',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#8b0000', marginBottom: 6 }}>
                {ru.appSubtitle}
              </div>
              <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', fontWeight: 900, color: '#f0ece0', margin: 0, lineHeight: 1.1 }}>
                {ru.appTitle}
              </h1>
              <div style={{ color: '#5a5660', fontSize: '0.9rem', marginTop: 4 }}>
                {ru.kindredCount(characters.length)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {account && (
                <div style={{ color: '#d7d1c7', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', border: '1px solid #2a2030', padding: '8px 12px', borderRadius: 999 }}>
                  {account.username}
                </div>
              )}
              <button className="btn-ghost" onClick={() => importRef.current?.click()}>
                {ru.importJson}
              </button>
              <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
              <button className="btn-primary" onClick={onNew}>
                {ru.newCharacter}
              </button>
              {account && (
                <button className="btn-ghost" onClick={onLogout}>
                  {ru.logoutBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 32px 0' }}>
        {characters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#3a3640' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: 12, opacity: 0.3 }}>✦</div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: 8, color: '#4a4460' }}>
              {ru.noRecords}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#3a3640', marginBottom: 28 }}>
              {ru.noRecordsHint}
            </div>
            <button className="btn-primary" onClick={onNew}>{ru.createFirst}</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {characters.map(char => (
              <div
                key={char.id}
                className="card-char"
                onClick={() => onOpen(char.id)}
                style={{ padding: '16px', position: 'relative' }}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <ClanGlyph clan={char.clan} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', fontWeight: 700, color: '#f0ece0', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {char.name || ru.unnamed}
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                      {char.clan && (
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#8b0000' }}>
                          {char.clan}
                        </span>
                      )}
                      {char.predatorType && (
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a5660' }}>
                          {char.predatorType}
                        </span>
                      )}
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a5660' }}>
                        {ru.gen} {char.generation}
                      </span>
                    </div>
                    {char.concept && (
                      <div style={{ fontSize: '0.85rem', color: '#7a7670', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {char.concept}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid #1e1c28' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: '#3a3640' }}>
                    {formatDate(char.updatedAt)}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.55rem' }} onClick={(e) => handleExport(e, char)}>
                      {ru.exportBtn}
                    </button>
                    <button className="btn-ghost" style={{ padding: '3px 10px', fontSize: '0.55rem' }} onClick={(e) => handleDuplicate(e, char)}>
                      {ru.cloneBtn}
                    </button>
                    <button className="btn-danger" style={{ padding: '3px 10px', fontSize: '0.55rem' }} onClick={(e) => handleDelete(e, char.id)}>
                      {ru.deleteBtn}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
