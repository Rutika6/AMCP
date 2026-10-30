import React from 'react';

const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';

export default function ProfileCard({ profile }) {
  return <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 18, borderBottom: '1px solid var(--color-border)' }}><span className="avatar" style={{ width: 58, height: 58, fontSize: 18 }}>{initials(profile.name)}</span><div><h2 style={{ margin: 0 }}>{profile.name}</h2><div className="muted">{profile.email}</div></div></div>
    {profile.bio && <section className="section" style={{ marginTop: 18 }}><h3>About</h3><p>{profile.bio}</p></section>}
    {(profile.collegeName || profile.course || profile.graduationYear) && <section className="section" style={{ marginTop: 18 }}><h3>Education</h3><p>{[profile.collegeName, profile.course, profile.graduationYear].filter(Boolean).join(' · ')}</p></section>}
    <section className="section" style={{ marginTop: 18 }}><h3>Skills</h3>{profile.skills?.length ? <div className="skill-list">{profile.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div> : <p className="muted">No skills added yet.</p>}</section>
    {(profile.githubUrl || profile.portfolioUrl) && <section className="section" style={{ marginTop: 18 }}><h3>Links</h3><div className="stack">{profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub profile</a>}{profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noreferrer">Portfolio</a>}</div></section>}
  </div>;
}
