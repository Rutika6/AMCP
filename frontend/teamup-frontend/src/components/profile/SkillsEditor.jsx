import React, { useState } from 'react';
import Button from '../common/Button';

export default function SkillsEditor({ skills, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput('');
    }
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a skill e.g. React"
          style={{ padding: 8, borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}
        />
        <Button onClick={addSkill}>Add</Button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {skills.map((skill) => (
          <span
            key={skill}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: '0.85rem',
            }}
          >
            {skill}{' '}
            <span style={{ cursor: 'pointer', color: 'var(--color-danger)' }} onClick={() => removeSkill(skill)}>
              ✕
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
