import { usePrefs } from '@cryptomines-network/api-react';

export default function useSuppressShareOnCreate() {
  return usePrefs<boolean>('suppressShareOnCreate', false);
}
