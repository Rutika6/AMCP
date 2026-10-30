import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/common/EmptyState';

export default function ProjectsPage() {
  return <MainLayout><div className="page-heading"><h1>My projects</h1><p>Project work connected to your teams.</p></div><EmptyState title="Project records aren’t available yet." action={<Link to="/teams/mine">View your teams</Link>}>The current TeamUp data model tracks teams and applications. Once project spaces are added, they’ll be listed here.</EmptyState></MainLayout>;
}
