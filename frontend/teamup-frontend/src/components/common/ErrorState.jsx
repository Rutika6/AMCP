import React from 'react';
import Button from './Button';

export default function ErrorState({ message = 'Unable to load this information.', onRetry }) {
  return <div className="empty-state"><p className="error-text">{message}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>;
}
