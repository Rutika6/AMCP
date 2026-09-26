import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import { isValidPassword } from '../../utils/validators';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setError('Password must be 8+ characters and include a letter and a number');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSaving(true);
    try {
      await authService.resetPassword(token, password);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset your password');
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <p className="error-text">This password-reset link is missing or invalid.</p>
        <Link to="/forgot-password">Request a new link</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Input label="New Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input label="Confirm New Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        {error && <p className="error-text">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Resetting...' : 'Reset Password'}</Button>
      </form>
    </AuthLayout>
  );
}
