import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authService } from '../../services/authService';
import { isValidEmail } from '../../utils/validators';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <p>If an account exists for {email}, a reset link has been sent.</p>
        <Link to="/login">Back to login</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit">Send Reset Link</Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/login">Back to login</Link>
      </p>
    </AuthLayout>
  );
}
