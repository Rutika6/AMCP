import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import SkillsEditor from '../../components/profile/SkillsEditor';
import Loader from '../../components/common/Loader';
import { profileService } from '../../services/profileService';

export default function EditProfile() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    profileService.getMyProfile().then((res) => setForm(res.data));
  }, []);

  if (!form) return (
    <MainLayout>
      <Loader />
    </MainLayout>
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateProfile(form);
      if (form.githubUrl) {
        await profileService.linkGithub(form.githubUrl);
      }
      navigate('/profile');
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
        <Input label="GitHub URL" name="githubUrl" value={form.githubUrl || ''} onChange={handleChange} />
        <div className="form-group">
          <label>Skills</label>
          <SkillsEditor
            skills={form.skills || []}
            onChange={(skills) => setForm({ ...form, skills })}
          />
        </div>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </MainLayout>
  );
}
