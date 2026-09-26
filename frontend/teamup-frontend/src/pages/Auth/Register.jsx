import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { validateRegisterForm } from '../../utils/validators';

export default function Register() {
  const { values, errors, setErrors, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await register(values);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Input label="Full Name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
        <Input label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} />
        {serverError && <p className="error-text">{serverError}</p>}
        <Button type="submit">Create Account</Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}
