import { type NFTInfo } from '@cryptomines-network/api';

type NFTState = {
  nft?: NFTInfo;
  isLoading: boolean;
  error?: Error;
};

export default NFTState;
