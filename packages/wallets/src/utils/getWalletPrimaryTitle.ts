import { WalletType } from '@cryptomines-network/api';
import type { Wallet } from '@cryptomines-network/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'Cryptomines';
    default:
      return wallet.meta?.name ?? wallet.name;
  }
}
