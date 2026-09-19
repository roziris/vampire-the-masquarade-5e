import { FormEvent, useEffect, useState } from 'react';
import { Character, createBlankCharacter } from './types/character';
import { getCurrentAccount, loginAccount, logoutAccount, registerAccount } from './utils/auth';
import { loadAllCharacters, saveCharacter } from './utils/storage';
import { Library } from './components/Library';
import { CharacterSheet } from './components/CharacterSheet';
import { ru } from './i18n';

type View = { mode: 'auth' } | { mode: 'library' } | { mode: 'sheet'; character: Character };

type AuthMode = 'login' | 'register';

export default function App() {
  const [view, setView] = useState<View>(() => (getCurrentAccount() ? { mode: 'library' } : { mode: 'auth' }));
  const [account, setAccount] = useState(() => getCurrentAccount());
  const [characters, setCharacters] = useState<Character[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [form, setForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const refresh = () => setCharacters(loadAllCharacters());

  useEffect(() => {
    const current = getCurrentAccount();
    setAccount(current);
    if (current) {
      refresh();
      setView({ mode: 'library' });
    } else {
      setCharacters([]);
      setView({ mode: 'auth' });
    }
  }, []);

  const handleAuthSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = authMode === 'login'
      ? loginAccount(form.username, form.password)
      : registerAccount(form.username, form.password);

    if (!result.ok) {
      setAuthError(result.message || '');
      return;
    }

    setAccount(result.account ?? null);
    setAuthError('');
    setForm({ username: '', password: '' });
    refresh();
    setView({ mode: 'library' });
  };

  const handleLogout = () => {
    logoutAccount();
    setAccount(null);
    setCharacters([]);
    setView({ mode: 'auth' });
    setAuthMode('login');
    setForm({ username: '', password: '' });
    setAuthError('');
  };

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

  if (view.mode === 'auth') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420, background: '#121215', border: '1px solid #2a2030', borderRadius: 16, padding: 24 }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#f0ece0', marginBottom: 8, textAlign: 'center' }}>
            {ru.appTitle}
          </div>
          <div style={{ fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8b0000', textAlign: 'center', marginBottom: 20 }}>
            {ru.appSubtitle}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              className={`btn-ghost ${authMode === 'login' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setAuthMode('login')}
            >
              {ru.loginBtn}
            </button>
            <button
              className={`btn-ghost ${authMode === 'register' ? 'active' : ''}`}
              style={{ flex: 1 }}
              onClick={() => setAuthMode('register')}
            >
              {ru.registerBtn}
            </button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            <div style={{ display: 'grid', gap: 14 }}>
              <label style={{ display: 'grid', gap: 8, color: '#d7d1c7', fontSize: '0.9rem' }}>
                {ru.usernameLabel}
                <input
                  value={form.username}
                  onChange={event => setForm(prev => ({ ...prev, username: event.target.value }))}
                  placeholder={ru.usernamePlaceholder}
                  style={{ background: '#17171a', border: '1px solid #312b35', borderRadius: 10, color: '#f0ece0', padding: '12px 14px' }}
                />
              </label>

              <label style={{ display: 'grid', gap: 8, color: '#d7d1c7', fontSize: '0.9rem' }}>
                {ru.passwordLabel}
                <input
                  type="password"
                  value={form.password}
                  onChange={event => setForm(prev => ({ ...prev, password: event.target.value }))}
                  placeholder={ru.passwordPlaceholder}
                  style={{ background: '#17171a', border: '1px solid #312b35', borderRadius: 10, color: '#f0ece0', padding: '12px 14px' }}
                />
              </label>

              {authError ? (
                <div style={{ color: '#f5b4b4', background: '#2a1415', border: '1px solid #5a1f24', borderRadius: 8, padding: '8px 10px', fontSize: '0.85rem' }}>
                  {authError}
                </div>
              ) : null}

              <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: 8 }}>
                {authMode === 'login' ? ru.loginBtn : ru.registerBtn}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
      account={account}
      characters={characters}
      onOpen={openCharacter}
      onNew={newCharacter}
      onRefresh={refresh}
      onLogout={handleLogout}
    />
  );
}
