import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useForm } from '../../hooks/useForm';
import { validateTeamForm } from '../../utils/validators';

export default function TeamForm({ initialValues, onSubmit, submitLabel = 'Save team', submitting = false, onCancel }) {
  const { values, setValues, errors, setErrors, handleChange } = useForm(initialValues || { name: '', description: '', maxMembers: 4, skillsNeeded: '', isRecruiting: true });
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateTeamForm(values);
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }
    setServerError('');
    setSaving(true);
    try {
      await onSubmit({ ...values, maxMembers: Number(values.maxMembers), isRecruiting: Boolean(values.isRecruiting), skillsNeeded: values.skillsNeeded.split(',').map((skill) => skill.trim()).filter(Boolean) });
    } catch (error) {
      setServerError(error.response?.data?.message || 'Unable to save the team. Please try again.');
    } finally { setSaving(false); }
  };

  return <form onSubmit={handleSubmit}>
    <Input label="Team name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="A clear name for your team" />
    <div className="form-group"><label htmlFor="description">Description</label><textarea id="description" name="description" value={values.description} onChange={handleChange} rows={4} placeholder="What is the team working on?" />{errors.description && <span className="error-text">{errors.description}</span>}</div>
    <Input label="Maximum members" name="maxMembers" type="number" min="1" value={values.maxMembers} onChange={handleChange} error={errors.maxMembers} />
    <Input label="Skills needed (comma separated)" name="skillsNeeded" value={values.skillsNeeded} onChange={handleChange} placeholder="e.g. React, research, design" />
    <div className="form-group"><label htmlFor="isRecruiting">Applications</label><select id="isRecruiting" name="isRecruiting" value={values.isRecruiting ? 'open' : 'closed'} onChange={(event) => setValues((current) => ({ ...current, isRecruiting: event.target.value === 'open' }))}><option value="open">Open to applications</option><option value="closed">Closed</option></select></div>
    {serverError && <p className="error-text" role="alert">{serverError}</p>}
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button type="submit" disabled={saving || submitting}>{saving || submitting ? 'Saving…' : submitLabel}</Button>{onCancel && <Button type="button" variant="secondary" onClick={onCancel} disabled={saving || submitting}>Cancel</Button>}</div>
  </form>;
}
