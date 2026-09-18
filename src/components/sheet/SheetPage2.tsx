import { Character, Advantage, Weapon } from '../../types/character';
import { DotRating } from '../DotRating';
import { ru } from '../../i18n';

interface Props {
  char: Character;
  onChange: (updates: Partial<Character>) => void;
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#111116', border: '1px solid #1e1c28', padding: '16px' }}>
      <div className="section-header">{title}</div>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, multiline, rows }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number;
}) {
  return (
    <div>
      <div className="field-label mb-1">{label}</div>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={rows || 3} style={{ width: '100%', resize: 'vertical', padding: '6px 8px', lineHeight: 1.6 }} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={{ width: '100%', padding: '5px 8px' }} />
      )}
    </div>
  );
}

export function SheetPage2({ char, onChange }: Props) {
  const addAdvantage = () =>
    onChange({
      advantages: [...char.advantages, {
        id: crypto.randomUUID(), name: '', category: ru.catMerit, level: 1, description: '',
      }],
    });

  const removeAdvantage = (id: string) =>
    onChange({ advantages: char.advantages.filter(a => a.id !== id) });

  const updateAdvantage = (id: string, updates: Partial<Advantage>) =>
    onChange({ advantages: char.advantages.map(a => a.id === id ? { ...a, ...updates } : a) });

  const addWeapon = () =>
    onChange({ weapons: [...char.weapons, { id: crypto.randomUUID(), name: '', damage: '', notes: '' }] });

  const removeWeapon = (id: string) =>
    onChange({ weapons: char.weapons.filter(w => w.id !== id) });

  const updateWeapon = (id: string, updates: Partial<Weapon>) =>
    onChange({ weapons: char.weapons.map(w => w.id === id ? { ...w, ...updates } : w) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Advantages */}
      <SectionBox title={ru.sectionAdvantages}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button className="btn-ghost" style={{ padding: '4px 12px', fontSize: '0.6rem' }} onClick={addAdvantage}>
            {ru.addEntry}
          </button>
        </div>
        {char.advantages.length === 0 && (
          <div style={{ color: '#3a3640', fontSize: '0.9rem', textAlign: 'center', padding: '12px 0' }}>
            {ru.noAdvantages}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {char.advantages.map(adv => (
            <div key={adv.id} style={{ background: '#0d0d10', border: '1px solid #1e1c28', padding: '10px' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="text" value={adv.name} placeholder={ru.phAdvName}
                  onChange={e => updateAdvantage(adv.id, { name: e.target.value })}
                  style={{ flex: 1, minWidth: 120, padding: '4px 6px', fontFamily: 'Crimson Pro, serif', fontWeight: 600 }}
                />
                <select value={adv.category}
                  onChange={e => updateAdvantage(adv.id, { category: e.target.value })}
                  style={{ padding: '4px 6px', fontSize: '0.85rem', minWidth: 110 }}>
                  <option>{ru.catMerit}</option>
                  <option>{ru.catFlaw}</option>
                  <option>{ru.catBackground}</option>
                  <option>{ru.catLoresheets}</option>
                </select>
                <DotRating value={adv.level} max={5} onChange={v => updateAdvantage(adv.id, { level: v })} size="sm" />
                <button className="btn-danger" style={{ padding: '3px 8px', fontSize: '0.55rem' }}
                  onClick={() => removeAdvantage(adv.id)}>✕</button>
              </div>
              <input type="text" value={adv.description} placeholder={ru.phAdvDesc}
                onChange={e => updateAdvantage(adv.id, { description: e.target.value })}
                style={{ width: '100%', padding: '4px 6px', fontSize: '0.85rem' }}
              />
            </div>
          ))}
        </div>
      </SectionBox>

      {/* Haven */}
      <SectionBox title={ru.sectionHaven}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="field-label mb-1">{ru.labelHavenRating}</div>
            <DotRating value={char.haven.noHaven ? 0 : char.haven.rating} max={5}
              onChange={v => onChange({ haven: { ...char.haven, rating: v, noHaven: false } })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a7670' }}>
            <input type="checkbox" checked={char.haven.noHaven}
              onChange={e => onChange({ haven: { ...char.haven, noHaven: e.target.checked } })}
              style={{ accentColor: '#8b0000', width: 14, height: 14 }}
            />
            {ru.labelNoHaven}
          </label>
        </div>
        <TextField label={ru.fieldHavenMerits} value={char.haven.merits}
          onChange={v => onChange({ haven: { ...char.haven, merits: v } })}
          placeholder={ru.phHavenMerits} multiline rows={3} />
      </SectionBox>

      {/* Biography */}
      <SectionBox title={ru.sectionBiography}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
          <TextField label={ru.fieldTrueAge} value={char.trueAge} onChange={v => onChange({ trueAge: v })} placeholder={ru.phTrueAge} />
          <TextField label={ru.fieldApparentAge} value={char.apparentAge} onChange={v => onChange({ apparentAge: v })} placeholder={ru.phApparentAge} />
          <TextField label={ru.fieldDateOfBirth} value={char.dateOfBirth} onChange={v => onChange({ dateOfBirth: v })} placeholder={ru.phDateOfBirth} />
          <TextField label={ru.fieldDateOfDeath} value={char.dateOfDeath} onChange={v => onChange({ dateOfDeath: v })} placeholder={ru.phDateOfDeath} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TextField label={ru.fieldAppearance} value={char.appearance} onChange={v => onChange({ appearance: v })}
            placeholder={ru.phAppearance} multiline rows={3} />
          <TextField label={ru.fieldDistFeatures} value={char.distinguishingFeatures}
            onChange={v => onChange({ distinguishingFeatures: v })}
            placeholder={ru.phDistFeatures} multiline rows={2} />
          <TextField label={ru.fieldHistory} value={char.history} onChange={v => onChange({ history: v })}
            placeholder={ru.phHistory} multiline rows={6} />
        </div>
      </SectionBox>

      {/* Weapons */}
      <SectionBox title={ru.sectionWeapons}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button className="btn-ghost" style={{ padding: '4px 12px', fontSize: '0.6rem' }} onClick={addWeapon}>
            {ru.addWeapon}
          </button>
        </div>
        {char.weapons.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 32px', gap: 8, marginBottom: 6 }}>
              <div className="field-label">{ru.colWeaponName}</div>
              <div className="field-label">{ru.colDamage}</div>
              <div className="field-label">{ru.colNotes}</div>
              <div />
            </div>
            {char.weapons.map(w => (
              <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 32px', gap: 8, marginBottom: 6 }}>
                <input type="text" value={w.name} placeholder={ru.phWeaponName}
                  onChange={e => updateWeapon(w.id, { name: e.target.value })}
                  style={{ padding: '4px 6px', fontSize: '0.9rem' }} />
                <input type="text" value={w.damage} placeholder={ru.phDamage}
                  onChange={e => updateWeapon(w.id, { damage: e.target.value })}
                  style={{ padding: '4px 6px', fontSize: '0.9rem', fontFamily: 'JetBrains Mono, monospace' }} />
                <input type="text" value={w.notes} placeholder={ru.phWeaponNotes}
                  onChange={e => updateWeapon(w.id, { notes: e.target.value })}
                  style={{ padding: '4px 6px', fontSize: '0.9rem' }} />
                <button className="btn-danger" style={{ padding: '4px', fontSize: '0.6rem' }}
                  onClick={() => removeWeapon(w.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        {char.weapons.length === 0 && (
          <div style={{ color: '#3a3640', fontSize: '0.9rem', textAlign: 'center', padding: '12px 0' }}>
            {ru.noWeapons}
          </div>
        )}
      </SectionBox>

      {/* Gear */}
      <SectionBox title={ru.sectionGear}>
        <TextField label={ru.fieldPossessions} value={char.gear} onChange={v => onChange({ gear: v })}
          placeholder={ru.phGear} multiline rows={5} />
      </SectionBox>

      {/* Experience */}
      <SectionBox title={ru.sectionExperience}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { label: ru.labelTotalXP, value: char.totalXP, key: 'totalXP' },
            { label: ru.labelSpentXP, value: char.spentXP, key: 'spentXP' },
          ].map(({ label, value, key }) => (
            <div key={key}>
              <div className="field-label mb-1">{label}</div>
              <input type="number" min={0} value={value}
                onChange={e => onChange({ [key]: parseInt(e.target.value) || 0 } as Partial<Character>)}
                style={{ width: 80, padding: '5px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', textAlign: 'center' }}
              />
            </div>
          ))}
          <div>
            <div className="field-label mb-1">{ru.labelRemainingXP}</div>
            <div style={{
              width: 80, padding: '5px 8px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem',
              textAlign: 'center', border: '1px solid #2a2030',
              color: char.totalXP - char.spentXP < 0 ? '#c41230' : '#c8a050',
              background: '#0d0d10',
            }}>
              {char.totalXP - char.spentXP}
            </div>
          </div>
        </div>
      </SectionBox>
    </div>
  );
}
