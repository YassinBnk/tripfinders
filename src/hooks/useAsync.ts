import { useEffect, useState, type DependencyList } from "react";

/** Runs an async loader and exposes { data, loading, error }. Ignores stale responses. */
export function useAsync<T>(load: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: Error | null }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    load().then(
      (data) => active && setState({ data, loading: false, error: null }),
      (error: unknown) => active && setState({ data: null, loading: false, error: error instanceof Error ? error : new Error(String(error)) }),
    );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
