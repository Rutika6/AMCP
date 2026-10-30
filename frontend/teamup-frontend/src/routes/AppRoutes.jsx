import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/common/ProtectedRoute';

import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';

import Dashboard from '../pages/Dashboard';
import MyTeams from '../pages/Team/MyTeams';
import ProjectsPage from '../pages/ProjectsPage';

import MyProfile from '../pages/Profile/MyProfile';
import EditProfile from '../pages/Profile/EditProfile';

import CreateTeam from '../pages/Team/CreateTeam';
import EditTeam from '../pages/Team/EditTeam';
import TeamDetails from '../pages/Team/TeamDetails';
import ManageTeamMembers from '../pages/Team/ManageTeamMembers';
import ManageVacancies from '../pages/Team/ManageVacancies';

import SearchTeams from '../pages/Search/SearchTeams';

import ApplyToTeam from '../pages/Requests/ApplyToTeam';
import ManageRequests from '../pages/Requests/ManageRequests';

import NotificationsPage from '../pages/Notifications/NotificationsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/teams/mine" element={<ProtectedRoute><MyTeams /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

      <Route path="/teams/create" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
      <Route path="/teams/search" element={<ProtectedRoute><SearchTeams /></ProtectedRoute>} />
      <Route path="/teams/my-applications" element={<ProtectedRoute><ApplyToTeam /></ProtectedRoute>} />
      <Route path="/teams/:teamId" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
      <Route path="/teams/:teamId/edit" element={<ProtectedRoute><EditTeam /></ProtectedRoute>} />
      <Route path="/teams/:teamId/members" element={<ProtectedRoute><ManageTeamMembers /></ProtectedRoute>} />
      <Route path="/teams/:teamId/vacancies" element={<ProtectedRoute><ManageVacancies /></ProtectedRoute>} />
      <Route path="/teams/:teamId/requests" element={<ProtectedRoute><ManageRequests /></ProtectedRoute>} />

      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
