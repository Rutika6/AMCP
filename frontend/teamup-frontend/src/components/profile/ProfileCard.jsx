import React from 'react';

export default function ProfileCard({ profile }) {
  return (
    <div className="card">
      <h2 style={{ margin: '0 0 4px' }}>{profile.name}</h2>
      <p style={{ color: 'var(--color-text-muted)', margin: '0 0 12px' }}>{profile.email}</p>
      {profile.bio && <p>{profile.bio}</p>}
      {profile.skills?.length > 0 && (
        <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
      )}
      {profile.githubUrl && (
        <p>
          <strong>GitHub:</strong>{' '}
          <a href={profile.githubUrl} target="_blank" rel="noreferrer">
            {profile.githubUrl}
          </a>
        </p>
      )}
    </div>
  );
}
