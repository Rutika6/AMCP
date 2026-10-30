import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import TeamList from '../../components/team/TeamList';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';

const emptyFilters = { keyword: '', skill: '', recruiting: '', hasCapacity: false, minMembers: '', maxMembers: '', sort: 'newest' };

export default function SearchTeams() {
  const [form, setForm] = useState(emptyFilters);
  const [filters, setFilters] = useState({ sort: 'newest' });
  const { data: teams, loading, error, refetch } = useFetch(() => teamService.searchTeams(filters), [filters]);
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const next = { keyword: form.keyword.trim(), skill: form.skill.trim(), recruiting: form.recruiting, hasCapacity: form.hasCapacity, minMembers: form.minMembers, maxMembers: form.maxMembers, sort: form.sort };
    Object.keys(next).forEach((key) => { if (next[key] === '' || next[key] === false) delete next[key]; });
    setFilters(next);
  };
  const clear = () => { setForm(emptyFilters); setFilters({ sort: 'newest' }); };

  return (
    <MainLayout>
      <div className="page-heading"><h1>Discover teams</h1><p>Find a group working on something you care about.</p></div>
      <form className="card" onSubmit={submit}>
        <div className="search-form">
          <div className="form-group" style={{ margin: 0 }}><label htmlFor="keyword">Team name</label><input id="keyword" name="keyword" value={form.keyword} onChange={change} placeholder="Search teams" /></div>
          <div className="form-group" style={{ margin: 0 }}><label htmlFor="skill">Skill needed</label><input id="skill" name="skill" value={form.skill} onChange={change} placeholder="e.g. React" /></div>
          <Button type="submit">Search teams</Button>
        </div>
        <div className="search-filters">
          <label>Recruitment <select name="recruiting" value={form.recruiting} onChange={change}><option value="">Any status</option><option value="true">Recruiting</option><option value="false">Closed</option></select></label>
          <label><input type="checkbox" name="hasCapacity" checked={form.hasCapacity} onChange={change} /> Has open capacity</label>
          <label>Minimum members <input name="minMembers" type="number" min="0" value={form.minMembers} onChange={change} style={{ width: 82 }} /></label>
          <label>Maximum members <input name="maxMembers" type="number" min="0" value={form.maxMembers} onChange={change} style={{ width: 82 }} /></label>
          <label>Sort <select name="sort" value={form.sort} onChange={change}><option value="newest">Recently created</option><option value="oldest">Oldest first</option><option value="name">Name</option></select></label>
          <button type="button" className="btn btn-secondary" onClick={clear}>Clear filters</button>
        </div>
      </form>
      <section className="section">
        <div className="section-heading"><h2>Teams</h2>{!loading && !error && <span className="muted">{teams?.length || 0} results</span>}</div>
        {loading ? <Loader /> : error ? <ErrorState message="Unable to load teams." onRetry={refetch} /> : teams?.length ? <TeamList teams={teams} /> : <EmptyState title="No teams match these filters." action={<button className="btn btn-secondary" type="button" onClick={clear}>Clear filters</button>}>Try a different skill or search term.</EmptyState>}
      </section>
    </MainLayout>
  );
}
