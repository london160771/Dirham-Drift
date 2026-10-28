import { useEffect, useState } from 'react';

export function useUsedControls(input) {
  const [used, setUsed] = useState(() => new Set());
  useEffect(
    () =>
      input.onFirstUse((control) => {
        setUsed((prev) => new Set(prev).add(control === 'right' ? 'left' : control));
      }),
    [input],
  );
  return used;
}
