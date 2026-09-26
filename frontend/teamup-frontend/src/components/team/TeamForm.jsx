import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useForm } from '../../hooks/useForm';
import { validateTeamForm } from '../../utils/validators';

export default function TeamForm({ initialValues, onSubmit, submitLabel = 'Save Team', submitting = false, onCancel }) {
  const { values, errors, setErrors, handleChange } = useForm(
    initialValues || { name: '', description: '', maxMembers: 4, skillsNeeded: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTeamForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...values,
      maxMembers: Number(values.maxMembers),
      skillsNeeded: values.skillsNeeded
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Team Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />
      <Input
        label="Max Members"
        name="maxMembers"
        type="number"
        min="1"
        value={values.maxMembers}
        onChange={handleChange}
        error={errors.maxMembers}
      />
      <Input
        label="Skills Needed (comma separated)"
        name="skillsNeeded"
        value={values.skillsNeeded}
        onChange={handleChange}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : submitLabel}</Button>
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>}
      </div>
    </form>
  );
}
