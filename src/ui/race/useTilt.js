import { useEffect, useState } from 'react';
import { TILT } from '../../game/config/controls.js';
import { attachTilt, requestTiltPermission } from './tilt.js';

export function useTilt(input, wanted) {
  const [status, setStatus] = useState('on');
  const [note, setNote] = useState(false);
  useEffect(() => {
    if (!wanted || status !== 'on') return undefined;
    return attachTilt(input, {
      onNoData: () => {
        setStatus('failed');
        setNote(true);
      },
    });
  }, [input, wanted, status]);
  useEffect(() => {
    if (!note) return undefined;
    const timer = setTimeout(() => setNote(false), TILT.noteMs);
    return () => clearTimeout(timer);
  }, [note]);
  const retry = async () => {
    setNote(false);
    if ((await requestTiltPermission()) !== 'denied') setStatus('on');
  };
  return { active: wanted && status === 'on', note: wanted && note, retry };
}
