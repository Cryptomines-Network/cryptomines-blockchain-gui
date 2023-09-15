import { usePrefs } from '@cryptomines-network/api-react';

export default function useHideObjectionableContent() {
  return usePrefs<boolean>('hideObjectionableContent', true);
}
