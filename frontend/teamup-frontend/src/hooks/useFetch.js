import { useState, useEffect, useCallback } from 'react';

// requestFn: a function returning an axios promise, e.g. () => teamService.getMyTeams()
// deps: dependency array to re-trigger the fetch
export function useFetch(requestFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    requestFn()
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
