import { usePrefs } from '@cryptomines-network/api-react';

export default function useEnableFilePropagationServer() {
  return usePrefs<boolean>('enableFilePropagationServer', false);
}
