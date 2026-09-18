import { Character, DamageState } from '../../types/character';
import { DotRating } from '../DotRating';
import { DamageTrack } from '../DamageTrack';
import { ru } from '../../i18n';

interface Props {
  char: Character;
  onChange: (updates: Partial<Character>) => void;
}

type AttrKey = keyof Character['attributes'];
type SkillKey = keyof Character['skills'];

const PHYSICAL_ATTRS: { key: AttrKey; label: string }[] = [
  { key: 'strength', label: ru.attrStrength },
  { key: 'dexterity', label: ru.attrDexterity },
  { key: 'stamina', label: ru.attrStamina },
];

const SOCIAL_ATTRS: { key: AttrKey; label: string }[] = [
  { key: 'charisma', label: ru.attrCharisma },
  { key: 'manipulation', label: ru.attrManipulation },
  { key: 'composure', label: ru.attrComposure },
];

const MENTAL_ATTRS: { key: AttrKey; label: string }[] = [
  { key: 'intelligence', label: ru.attrIntelligence },
  { key: 'wits', label: ru.attrWits },
  { key: 'resolve', label: ru.attrResolve },
];

const PHYSICAL_SKILLS: { key: SkillKey; label: string }[] = [
  { key: 'athletics', label: ru.skillAthletics },
  { key: 'brawl', label: ru.skillBrawl },
  { key: 'craft', label: ru.skillCraft },
  { key: 'drive', label: ru.skillDrive },
  { key: 'firearms', label: ru.skillFirearms },
  { key: 'larceny', label: ru.skillLarceny },
  { key: 'melee', label: ru.skillMelee },
  { key: 'stealth', label: ru.skillStealth },
  { key: 'survival', label: ru.skillSurvival },
];

const SOCIAL_SKILLS: { key: SkillKey; label: string }[] = [
  { key: 'animalKen', label: ru.skillAnimalKen },
  { key: 'etiquette', label: ru.skillEtiquette },
  { key: 'insight', label: ru.skillInsight },
  { key: 'intimidation', label: ru.skillIntimidation },
  { key: 'leadership', label: ru.skillLeadership },
  { key: 'performance', label: ru.skillPerformance },
  { key: 'persuasion', label: ru.skillPersuasion },
  { key: 'streetwise', label: ru.skillStreetwise },
  { key: 'subterfuge', label: ru.skillSubterfuge },
];

const MENTAL_SKILLS: { key: SkillKey; label: string }[] = [
  { key: 'academics', label: ru.skillAcademics },
  { key: 'awareness', label: ru.skillAwareness },
  { key: 'finance', label: ru.skillFinance },
  { key: 'investigation', label: ru.skillInvestigation },
  { key: 'medicine', label: ru.skillMedicine },
  { key: 'occult', label: ru.skillOccult },
  { key: 'politics', label: ru.skillPolitics },
  { key: 'science', label: ru.skillScience },
  { key: 'technology', label: ru.skillTechnology },
];

const BP_TABLE: Record<number, { surge: string; mend: string; power: string; reroll: string; feed: string; bane: string }> = {
  0: { surge: '+1 кость', mend: '1 пов', power: 'нет', reroll: 'нет', feed: 'нет', bane: '1' },
  1: { surge: '+2 кости', mend: '1 пов', power: 'нет', reroll: 'нет', feed: 'нет', bane: '2' },
  2: { surge: '+2 кости', mend: '2 пов', power: '+1', reroll: 'да', feed: 'животное+', bane: '2' },
  3: { surge: '+3 кости', mend: '2 пов', power: '+1', reroll: 'да', feed: 'человек', bane: '3' },
  4: { surge: '+3 кости', mend: '3 пов', power: '+2', reroll: 'да', feed: 'человек', bane: '3' },
  5: { surge: '+4 кости', mend: '3 пов', power: '+2', reroll: 'да', feed: 'связ./вамп', bane: '4' },
  6: { surge: '+4 кости', mend: '3 аgg', power: '+3', reroll: 'да', feed: 'связ./вамп', bane: '4' },
  7: { surge: '+5 костей', mend: '3 аgg', power: '+3', reroll: 'да', feed: 'связ./вамп', bane: '5' },
  8: { surge: '+5 костей', mend: '4 аgg', power: '+4', reroll: 'да', feed: 'вампир', bane: '5' },
  9: { surge: '+6 костей', mend: '4 аgg', power: '+4', reroll: 'да', feed: 'вампир', bane: '6' },
  10: { surge: '+6 костей', mend: '5 аgg', power: '+5', reroll: 'да', feed: 'вампир', bane: '6' },
};

function TextField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <div className="field-label mb-1">{label}</div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={{ width: '100%', padding: '5px 8px' }} />
    </div>
  );
}

function AttrRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0' }}>
      <span style={{ fontSize: '0.95rem', color: '#d4d0c8', fontFamily: 'Crimson Pro, serif' }}>{label}</span>
      <DotRating value={value} max={5} onChange={onChange} />
    </div>
  );
}

function SkillRow({ label, value, spec, onValueChange, onSpecChange }: {
  label: string; value: number; spec: string;
  onValueChange: (v: number) => void; onSpecChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
      <span style={{ fontSize: '0.9rem', color: '#c4c0b8', fontFamily: 'Crimson Pro, serif', width: 160, flexShrink: 0 }}>{label}</span>
      <DotRating value={value} max={5} onChange={onValueChange} size="sm" />
      <input type="text" value={spec} onChange={e => onSpecChange(e.target.value)}
        placeholder={ru.phSpec}
        style={{ flex: 1, padding: '2px 6px', fontSize: '0.8rem', minWidth: 0 }} />
    </div>
  );
}

export function SheetPage1({ char, onChange }: Props) {
  const setAttr = (key: AttrKey, v: number) =>
    onChange({ attributes: { ...char.attributes, [key]: v } });

  const setSkill = (key: SkillKey, field: 'value' | 'spec', v: number | string) =>
    onChange({ skills: { ...char.skills, [key]: { ...char.skills[key], [field]: v } } });

  const healthBoxes = char.attributes.stamina + 3;
  const willBoxes = char.attributes.composure + char.attributes.resolve;

  const adjustTrack = (
    current: DamageState[],
    newSize: number,
    setter: (boxes: DamageState[]) => void
  ) => {
    if (current.length !== newSize) {
      const next = Array(newSize).fill('empty') as DamageState[];
      for (let i = 0; i < Math.min(current.length, newSize); i++) next[i] = current[i];
      setter(next);
    }
  };

  adjustTrack(char.healthDamage, healthBoxes, boxes => onChange({ healthDamage: boxes }));
  adjustTrack(char.willpowerDamage, willBoxes, boxes => onChange({ willpowerDamage: boxes }));

  const bp = Math.max(0, Math.min(10, char.bloodPotency));
  const bpRef = BP_TABLE[bp];

  const addDiscipline = () =>
    onChange({
      disciplines: [...char.disciplines, {
        id: crypto.randomUUID(), name: '', level: 1, powers: [],
      }],
    });

  const removeDiscipline = (id: string) =>
    onChange({ disciplines: char.disciplines.filter(d => d.id !== id) });

  const updateDiscipline = (id: string, updates: Partial<typeof char.disciplines[0]>) =>
    onChange({ disciplines: char.disciplines.map(d => d.id === id ? { ...d, ...updates } : d) });

  const addPower = (discId: string) =>
    updateDiscipline(discId, {
      powers: [...(char.disciplines.find(d => d.id === discId)?.powers ?? []),
        { id: crypto.randomUUID(), name: '', description: '' }],
    });

  const removePower = (discId: string, powId: string) => {
    const disc = char.disciplines.find(d => d.id === discId);
    if (!disc) return;
    updateDiscipline(discId, { powers: disc.powers.filter(p => p.id !== powId) });
  };

  const updatePower = (discId: string, powId: string, field: 'name' | 'description', val: string) => {
    const disc = char.disciplines.find(d => d.id === discId);
    if (!disc) return;
    updateDiscipline(discId, { powers: disc.powers.map(p => p.id === powId ? { ...p, [field]: val } : p) });
  };

  const col: React.CSSProperties = { background: '#111116', border: '1px solid #1e1c28', padding: '16px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Identity */}
      <div style={col}>
        <div className="section-header">{ru.sectionIdentity}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          <TextField label={ru.fieldName} value={char.name} onChange={v => onChange({ name: v })} placeholder={ru.phName} />
          <TextField label={ru.fieldConcept} value={char.concept} onChange={v => onChange({ concept: v })} placeholder={ru.phConcept} />
          <TextField label={ru.fieldPredator} value={char.predatorType} onChange={v => onChange({ predatorType: v })} placeholder={ru.phPredator} />
          <TextField label={ru.fieldClan} value={char.clan} onChange={v => onChange({ clan: v })} placeholder={ru.phClan} />
          <div>
            <div className="field-label mb-1">{ru.fieldGeneration}</div>
            <input type="number" min={4} max={16} value={char.generation}
              onChange={e => onChange({ generation: parseInt(e.target.value) || 13 })}
              style={{ width: '100%', padding: '5px 8px' }} />
          </div>
          <TextField label={ru.fieldSire} value={char.sire} onChange={v => onChange({ sire: v })} />
          <TextField label={ru.fieldChronicle} value={char.chronicle} onChange={v => onChange({ chronicle: v })} />
          <TextField label={ru.fieldAmbition} value={char.ambition} onChange={v => onChange({ ambition: v })} placeholder={ru.phAmbition} />
          <TextField label={ru.fieldDesire} value={char.desire} onChange={v => onChange({ desire: v })} placeholder={ru.phDesire} />
        </div>
      </div>

      {/* Attributes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: ru.sectionPhysical, attrs: PHYSICAL_ATTRS },
          { label: ru.sectionSocial, attrs: SOCIAL_ATTRS },
          { label: ru.sectionMental, attrs: MENTAL_ATTRS },
        ].map(({ label, attrs }) => (
          <div key={label} style={col}>
            <div className="section-header">{label}</div>
            {attrs.map(({ key, label: al }) => (
              <AttrRow key={key} label={al} value={char.attributes[key]} onChange={v => setAttr(key, v)} />
            ))}
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: ru.sectionPhysicalSkills, skills: PHYSICAL_SKILLS },
          { label: ru.sectionSocialSkills, skills: SOCIAL_SKILLS },
          { label: ru.sectionMentalSkills, skills: MENTAL_SKILLS },
        ].map(({ label, skills }) => (
          <div key={label} style={col}>
            <div className="section-header">{label}</div>
            {skills.map(({ key, label: sl }) => (
              <SkillRow key={key} label={sl}
                value={char.skills[key].value} spec={char.skills[key].spec}
                onValueChange={v => setSkill(key, 'value', v)}
                onSpecChange={v => setSkill(key, 'spec', v)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Tracks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={col}>
          <div className="section-header">{ru.sectionTracks}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DamageTrack
              label={ru.labelHealth(char.attributes.stamina, healthBoxes)}
              boxes={char.healthDamage.slice(0, healthBoxes)}
              onChange={boxes => onChange({ healthDamage: boxes })}
            />
            <DamageTrack
              label={ru.labelWillpower(char.attributes.composure, char.attributes.resolve, willBoxes)}
              boxes={char.willpowerDamage.slice(0, willBoxes)}
              onChange={boxes => onChange({ willpowerDamage: boxes })}
            />
            <div>
              <div className="field-label mb-1">{ru.labelHumanity}</div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                {Array.from({ length: 10 }, (_, i) => {
                  const idx = i + 1;
                  const filled = idx <= char.humanity;
                  return (
                    <span key={i} className="track-box"
                      style={{
                        borderColor: filled ? '#d4d0c8' : '#2a2030',
                        color: filled ? '#d4d0c8' : 'transparent',
                        background: filled ? '#1a1820' : 'transparent',
                      }}
                      onClick={() => onChange({ humanity: char.humanity === idx ? idx - 1 : idx })}>
                      {filled ? '●' : '○'}
                    </span>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: char.humanity }, (_, i) => {
                  const stained = i < char.stains;
                  return (
                    <span key={i} className="track-box"
                      style={{
                        borderColor: stained ? '#c8a050' : '#2a2030',
                        color: stained ? '#c8a050' : 'transparent',
                        fontSize: '9px',
                      }}
                      onClick={() => onChange({ stains: char.stains === i + 1 ? i : i + 1 })}>
                      {stained ? '/' : ''}
                    </span>
                  );
                })}
                {char.humanity > 0 && (
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#5a5660', marginLeft: 6, alignSelf: 'center' }}>
                    {ru.labelStains(char.stains)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="field-label mb-2">{ru.labelHunger}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}
                    className={`dot hunger-dot ${i < char.hunger ? 'filled' : ''}`}
                    style={{ width: 18, height: 18 }}
                    onClick={() => onChange({ hunger: char.hunger === i + 1 ? i : i + 1 })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={col}>
          <div className="section-header">{ru.sectionBloodPotency}</div>
          <div style={{ marginBottom: 12 }}>
            <DotRating value={char.bloodPotency} max={10} onChange={v => onChange({ bloodPotency: v })} />
          </div>
          {bpRef && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                [ru.bpBloodSurge, bpRef.surge],
                [ru.bpMendAmount, bpRef.mend],
                [ru.bpPowerBonus, bpRef.power],
                [ru.bpRouseReroll, bpRef.reroll],
                [ru.bpFeedingPenalty, bpRef.feed],
                [ru.bpBaneSeverity, bpRef.bane],
              ].map(([k, v]) => (
                <div key={k} style={{ background: '#0d0d10', border: '1px solid #1e1c28', padding: '8px 10px' }}>
                  <div className="field-label" style={{ marginBottom: 2 }}>{k}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#c8a050' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disciplines */}
      <div style={col}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="section-header" style={{ margin: 0 }}>{ru.sectionDisciplines}</div>
          <button className="btn-ghost" style={{ padding: '4px 12px', fontSize: '0.6rem' }} onClick={addDiscipline}>
            {ru.addDiscipline}
          </button>
        </div>
        {char.disciplines.length === 0 && (
          <div style={{ color: '#3a3640', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
            {ru.noDisciplines}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {char.disciplines.map(disc => (
            <div key={disc.id} style={{ background: '#0d0d10', border: '1px solid #1e1c28', padding: '12px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <input type="text" value={disc.name} placeholder={ru.phDisciplineName}
                  onChange={e => updateDiscipline(disc.id, { name: e.target.value })}
                  style={{ flex: 1, padding: '5px 8px', fontFamily: 'Cinzel, serif', fontWeight: 600 }}
                />
                <DotRating value={disc.level} max={5} onChange={v => updateDiscipline(disc.id, { level: v })} />
                <button className="btn-danger" style={{ padding: '3px 10px', fontSize: '0.55rem' }}
                  onClick={() => removeDiscipline(disc.id)}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {disc.powers.map(pow => (
                  <div key={pow.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <input type="text" value={pow.name} placeholder={ru.phPowerName}
                      onChange={e => updatePower(disc.id, pow.id, 'name', e.target.value)}
                      style={{ width: 180, flexShrink: 0, padding: '4px 6px', fontSize: '0.85rem' }}
                    />
                    <input type="text" value={pow.description} placeholder={ru.phPowerDesc}
                      onChange={e => updatePower(disc.id, pow.id, 'description', e.target.value)}
                      style={{ flex: 1, padding: '4px 6px', fontSize: '0.85rem' }}
                    />
                    <button className="btn-danger" style={{ padding: '3px 8px', fontSize: '0.55rem', flexShrink: 0 }}
                      onClick={() => removePower(disc.id, pow.id)}>✕</button>
                  </div>
                ))}
                <button className="btn-ghost" style={{ alignSelf: 'flex-start', padding: '3px 10px', fontSize: '0.58rem' }}
                  onClick={() => addPower(disc.id)}>
                  {ru.addPower}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tenets / Touchstones / Bane / Resonance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: ru.sectionTenets, key: 'tenets', ph: ru.phTenets },
          { label: ru.sectionTouchstones, key: 'touchstones', ph: ru.phTouchstones },
          { label: ru.sectionClanBane, key: 'clanBane', ph: ru.phClanBane },
          { label: ru.sectionResonance, key: 'resonance', ph: ru.phResonance },
        ].map(({ label, key, ph }) => (
          <div key={key} style={col}>
            <div className="section-header">{label}</div>
            <textarea
              value={(char as Record<string, unknown>)[key] as string}
              onChange={e => onChange({ [key]: e.target.value } as Partial<Character>)}
              placeholder={ph}
              rows={4}
              style={{ width: '100%', resize: 'vertical', padding: '6px 8px', lineHeight: 1.6 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
