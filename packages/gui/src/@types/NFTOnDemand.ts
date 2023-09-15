import { type NFTInfo } from '@cryptomines-network/api';

type NFTOnDemand = {
  nft?: NFTInfo;
  error?: Error;
  promise?: Promise<NFTInfo>;
};

export default NFTOnDemand;
