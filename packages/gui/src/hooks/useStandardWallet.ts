import type { Wallet } from '@cryptomines-network/api';
import { WalletType } from '@cryptomines-network/api';
import { useGetWalletsQuery, useGetWalletBalanceQuery } from '@cryptomines-network/api-react';
import { useMemo } from 'react';

export default function useStandardWallet(): {
  loading: boolean;
  wallet?: Wallet;
  balance?: number;
} {
  const { data: wallets, isLoading: isLoadingGetWallets } = useGetWalletsQuery();
  const { data: balance, isLoading: isLoadingWalletBalance } = useGetWalletBalanceQuery({
    walletId: 1,
  });

  const isLoading = isLoadingGetWallets || isLoadingWalletBalance;

  const wallet = useMemo(() => wallets?.find((item: Wallet) => item?.type === WalletType.STANDARD_WALLET), [wallets]);

  return {
    loading: isLoading,
    wallet,
    balance: balance?.confirmedWalletBalance,
  };
}
