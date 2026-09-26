import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';

export default function Login() {
  const { values, errors, setErrors, handleChange } = useForm({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!isValidEmail(values.email)) validationErrors.email = 'Enter a valid email';
    if (!values.password) validationErrors.password = 'Password is required';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await login(values);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} />
        {serverError && <p className="error-text">{serverError}</p>}
        <Button type="submit">Login</Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p style={{ textAlign: 'center' }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
}
