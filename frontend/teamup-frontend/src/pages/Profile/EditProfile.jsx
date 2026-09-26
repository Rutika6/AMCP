import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SkillsEditor from '../../components/profile/SkillsEditor';
import Loader from '../../components/common/Loader';
import { profileService } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';

export default function EditProfile() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    profileService
      .getMyProfile()
      .then((res) => setForm(res.data))
      .catch(() => setLoadError('Unable to load your profile. Please try again.'));
  }, []);

  if (loadError) return (
    <MainLayout>
      <h1>Edit Profile</h1>
      <p className="error-text">{loadError}</p>
    </MainLayout>
  );

  if (!form) return (
    <MainLayout>
      <Loader />
    </MainLayout>
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      const res = await profileService.updateProfile(form);
      setUser(res.data);
      navigate('/profile');
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Unable to save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="card">
        <Input label="Full Name" name="name" value={form.name || ''} onChange={handleChange} />
        <Input label="Bio" name="bio" value={form.bio || ''} onChange={handleChange} />
        <Input label="GitHub Profile URL" name="githubUrl" type="url" value={form.githubUrl || ''} onChange={handleChange} />
        <Input label="Portfolio URL" name="portfolioUrl" type="url" value={form.portfolioUrl || ''} onChange={handleChange} />
        <Input label="College / University" name="collegeName" value={form.collegeName || ''} onChange={handleChange} />
        <Input label="Course / Program" name="course" value={form.course || ''} onChange={handleChange} />
        <Input label="Graduation Year" name="graduationYear" value={form.graduationYear || ''} onChange={handleChange} />
        <div className="form-group">
          <label>Skills</label>
          <SkillsEditor
            skills={form.skills || []}
            onChange={(skills) => setForm({ ...form, skills })}
          />
        </div>
        {saveError && <p className="error-text">{saveError}</p>}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/profile')} disabled={saving}>
            Cancel
          </Button>
        </div>
      </form>
    </MainLayout>
  );
}
