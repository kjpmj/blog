import { useEffect, MutableRefObject } from 'react';

export default function useOutsideAlerter(
  ref: MutableRefObject<any>,
  callback: Function,
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
