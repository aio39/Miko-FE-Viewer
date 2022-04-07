// NOTE 일부 "undefined"로 저장되는 경우가 있었음.
import { AtomEffect } from 'recoil';

export const localStorageBooleanEffect: (key: string) => AtomEffect<boolean> =
  key =>
  ({ setSelf, onSet }) => {
    if (typeof window === 'undefined') return;
    const savedValue = localStorage.getItem(key);

    if (savedValue != null) {
      try {
        const parsed = JSON.parse(savedValue);
        if (parsed === 'true') {
          setSelf(true);
        }
      } catch {
        setSelf(false);
      }
    }

    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(key);
      } else if (newValue) {
        // NOTE undefined의 경우 "undefined"로 저장되는 버그 수정
        localStorage.setItem(key, JSON.stringify(newValue));
      } else {
        localStorage.removeItem(key);
      }
    });
  };
