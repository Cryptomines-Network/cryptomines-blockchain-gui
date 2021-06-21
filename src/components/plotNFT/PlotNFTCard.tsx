import React from 'react';
import styled from 'styled-components';
import { Trans } from '@lingui/macro';
import { useHistory } from 'react-router';
import { TooltipTypography, AlertDialog, Flex, State, UnitFormat, CardKeyValue, Tooltip, More, Loading, FormatLargeNumber } from '@chia/core';
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import type PlotNFT from '../../types/PlotNFT';
import PlotNFTName from './PlotNFTName';
import PlotNFTStatus from './PlotNFTState';
import WalletStatus from '../wallet/WalletStatus';
import useAbsorbRewards from '../../hooks/useAbsorbRewards';
import PlotIcon from '../icons/Plot';
import usePlotNFTDetails from '../../hooks/usePlotNFTDetails';
import useOpenDialog from '../../hooks/useOpenDialog';
import PoolJoin from '../pool/PoolJoin';
import { mojo_to_chia } from '../../util/chia';


const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledSyncingFooter = styled(CardContent)`
  background-color: ${({ theme }) =>
    theme.palette.type === 'dark' ? '#515151' : '#F6F6F6'};
  padding: 2rem 3rem;
  text-align: center;
  borer-top: 1px solid #D8D6D6;
`;

type Props = {
  nft: PlotNFT;
};

export default function PlotNFTCard(props: Props) {
  const { 
    nft,
    nft: {
      pool_state: {
        p2_singleton_puzzle_hash,
        pool_config: {
          launcher_id,
        },
      },
    },
  } = props;

  const history = useHistory();
  const openDialog = useOpenDialog();
  const absorbRewards = useAbsorbRewards(nft);
  const { isSelfPooling, canEdit, isSynced, plots, balance } = usePlotNFTDetails(nft);

  async function handleClaimRewards() {
    if (!canEdit) {
      return;
    }

    return absorbRewards();
  }

  async function handleJoinPool() {
    if (!canEdit) {
      return;
    }

    if (isSelfPooling && balance) {
      await openDialog(
        <AlertDialog>
          <Trans>You need to claim your rewards first</Trans>
        </AlertDialog>,
      );
      return;
    }

    history.push(`/dashboard/pool/${p2_singleton_puzzle_hash}/change-pool`);
  }

  function handleAddPlot() {
    history.push({
      pathname: '/dashboard/plot/add',
      state: {
        p2_singleton_puzzle_hash,
      },
    });
  }

  const rows = [{
    key: 'status',
    label: <Trans>Status</Trans>,
    value: <PlotNFTStatus nft={nft} />,
  }, {
    key: 'wallet_status',
    label: <Trans>Wallet Status</Trans>,
    value: <WalletStatus />,
  }, isSelfPooling && {
    key: 'rewards',
    label: <Trans>Rewards</Trans>,
    value: <UnitFormat value={mojo_to_chia(BigInt(balance))} state={State.SUCCESS} />,
  }, {
    key: 'plots_count',
    label: <Trans>Number of Plots</Trans>,
    value: plots
      ? <FormatLargeNumber value={plots.length} />
      : <Loading size="small" />,
  }, !isSelfPooling && {
    key: 'current_difficulty',
    label: (
      <TooltipTypography 
        title={(
          <Trans>
            This difficulty is an artifically lower difficulty than on the real network,
            and is used when farming, in order to find more proofs and send them to the pool.
            The more plots you have, the higher difficulty you will have.
            However, the difficulty does not affect rewards.
          </Trans>
        )}
      >
        <Trans>Current Difficulty</Trans>
      </TooltipTypography>
    ),
    value: <FormatLargeNumber value={nft.pool_state.current_difficulty} />,
  }, !isSelfPooling && {
    key: 'current_points',
    label: (
      <TooltipTypography 
        title={(
          <Trans>
            This is the total number of points this plotNFT has with this pool, 
            since the last payout. The pool will reset the points after making a payout.
          </Trans>
        )}
      >
        <Trans>Current Points Balance</Trans>
      </TooltipTypography>
    ),
    value: <FormatLargeNumber value={nft.pool_state.current_points} />,
  }, !isSelfPooling && {
    key: 'points_found_since_start',
    label: (
      <TooltipTypography 
        title={(
          <Trans>
            This is the total number of points your farmer has found for this plot NFT. 
            Each k32 plot will get around 10 points per day, 
            so if you have 10TiB, should should expect around 1000 points per day, 
            or 41 points per hour.
          </Trans>
        )}
      >
        <Trans>Points Found Since Start</Trans>
      </TooltipTypography>
    ),
    value: <FormatLargeNumber value={nft.pool_state.points_found_since_start} />,
  }].filter(row => !!row);

  return (
    <StyledCard>
      <StyledCardContent>
        <Flex flexDirection="column" gap={4} flexGrow={1}>
          <Flex flexDirection="column" gap={1}>
            <Flex gap={1}>
              <Box flexGrow={1}>
                <PlotNFTName nft={nft} variant="h6" />
              </Box>
              <More>
                {({ onClose }) => (
                  <Box>
                    <MenuItem onClick={() => { onClose(); handleAddPlot(); }}>
                      <ListItemIcon>
                        <PlotIcon />
                      </ListItemIcon>
                      <Typography variant="inherit" noWrap>
                        <Trans>Add a Plot</Trans>
                      </Typography>
                    </MenuItem>
                  </Box>
                )}
              </More>
            </Flex>
          </Flex>

          <Flex flexDirection="column" flexGrow={1}>
            <CardKeyValue rows={rows} hideDivider />
          </Flex>

          <Flex flexDirection="column" gap={1}>
            <Typography variant="body1" color="textSecondary" noWrap>
              <Trans>Launcher Id</Trans>
            </Typography>
            <Tooltip title={launcher_id} copyToClipboard>
              <Typography variant="body2" noWrap>
                {launcher_id}
              </Typography>
            </Tooltip>
          </Flex> 


          {isSynced && (
            <Grid container spacing={1}>
              {isSelfPooling && (
                <Grid container xs={6} item>
                  <Button
                    variant="contained"
                    onClick={handleClaimRewards}
                    disabled={!canEdit}
                    fullWidth
                  >
                    <Flex flexDirection="column" gap={0}>
                      <Typography variant="body1">
                        <Trans>Claim Rewards</Trans>
                      </Typography>
                    </Flex>
                  </Button>
                </Grid>
              )}

              <Grid container xs={isSelfPooling ? 6 : 12} item>
                <PoolJoin nft={nft}>
                  {({ join, disabled }) => (
                    <Button
                      variant="contained"
                      onClick={join}
                      disabled={disabled}
                      color="primary"
                      fullWidth
                    >
                      <Flex flexDirection="column" gap={1}>
                        <Typography variant="body1">
                          {isSelfPooling 
                            ? <Trans>Join Pool</Trans>
                            : <Trans>Change Pool</Trans>
                          }
                        </Typography>
                      </Flex>
                    </Button>
                  )}
                </PoolJoin>
              </Grid>
            </Grid>
          )}
        </Flex>
      </StyledCardContent>
      {!isSynced && (
        <StyledSyncingFooter>
          <Flex alignItems="center">
            <Typography variant="body2">
              <Trans>
                You can still create plots for this plot NFT, but you can not make changes until sync is complete.
              </Trans>
            </Typography>
          </Flex>
        </StyledSyncingFooter>
      )}
    </StyledCard>
  );
}