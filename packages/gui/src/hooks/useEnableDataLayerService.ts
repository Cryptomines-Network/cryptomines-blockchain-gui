import { usePrefs } from '@cryptomines-network/api-react';

export default function useEnableDataLayerService() {
  return usePrefs<boolean>('enableDataLayerService', false);
}
