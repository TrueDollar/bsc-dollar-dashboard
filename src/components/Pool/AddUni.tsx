import React, {useState} from 'react';
import {
  Box, Button, IconCirclePlus, IconArrowUp
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {OverlayTrigger, Tooltip} from "react-bootstrap";

import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {approve, approveTSD, depositPool, providePool, withdrawPool} from '../../utils/web3';
import {buyUniV2} from '../../utils/infura';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {ZAP, USDC, TSD, UNI} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";

type AddUniProps = {
  user: string
  balanceUSDC: BigNumber,
  zapTSDAllowance: BigNumber,
  zapUSDCAllowance: BigNumber,
  accountUNIBalance: BigNumber,
  balanceTSD: BigNumber,
};

function AddUni({
                  user, balanceUSDC, zapTSDAllowance, accountUNIBalance, balanceTSD, zapUSDCAllowance
                }: AddUniProps) {
  const [amountTSD, setAmountTSD] = useState(new BigNumber(0));
  const [amountUSDC, setAmountUSDC] = useState(new BigNumber(0));

  const onChangeAmountTSD = (amount) => {
    setAmountTSD(amount);
  };

  const onChangeAmountUSDC = (amount) => {
    setAmountUSDC(amount);
  };

  return (
    <Box heading="Get UNI-V2 with your USDC">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={{flexBasis: '32%'}}>
          <BalanceBlock asset="Balance" balance={accountUNIBalance} suffix={"UNI-V2"}/>
        </div>
        <div style={{flexBasis: '33%'}}>
          <BalanceBlock asset="USDC Balance" balance={balanceUSDC} suffix={"USDC"}/>
          <BalanceBlock asset="TSD Balance" balance={balanceTSD} suffix={"TSD"}/>
        </div>
        <div style={{flexBasis: '2%'}}/>
        <div style={{flexBasis: '33%', paddingTop: '2%'}}>
          {
            zapUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0
              ? <div style={{display: 'flex'}}>
                <div style={{width: '60%', minWidth: '6em'}}>
                  <BigNumberInput
                    adornment="USDC"
                    value={amountUSDC}
                    setter={onChangeAmountUSDC}
                  />
                  {/*<PriceSection label="Requires " amt={usdcAmount} symbol=" USDC"/>*/}
                  <MaxButton
                    onClick={() => {
                      onChangeAmountUSDC(balanceUSDC);
                    }}
                    title="Max"
                  />
                </div>
                <div style={{width: '40%', minWidth: '6em'}}>
                  {
                    !isPos(amountUSDC)
                      ? <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip">
                            Make sure the value &gt; 0
                          </Tooltip>
                        }
                      >
                        <div style={{display: 'inline-block', cursor: 'not-allowed'}}>
                          <Button
                            style={{pointerEvents: 'none'}}
                            wide
                            icon={<IconArrowUp/>}
                            label="Get UNI-V2"
                            disabled={!isPos(amountUSDC)}
                          />
                        </div>
                      </OverlayTrigger>
                      : <Button
                        wide
                        icon={<IconArrowUp/>}
                        label="Get UNI-V2"
                        onClick={() => buyUniV2(user, toBaseUnitBN(amountUSDC, USDC.decimals), USDC.addr)}
                      />
                  }
                </div>
              </div>
              : <Button
                wide
                icon={<IconCirclePlus/>}
                label="Approve"
                onClick={() => {
                  approve(USDC.addr, ZAP.addr);
                }}
                disabled={user === ''}
              />
          }
          {
            zapTSDAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0
              ? <div style={{display: 'flex'}}>
                <div style={{width: '60%', minWidth: '6em'}}>
                  <BigNumberInput
                    adornment="TSD"
                    value={amountTSD}
                    setter={onChangeAmountTSD}
                  />
                  {/*<PriceSection label="Requires " amt={usdcAmount} symbol=" USDC"/>*/}
                  <MaxButton
                    onClick={() => {
                      onChangeAmountTSD(balanceTSD);
                    }}
                    title="Max"
                  />
                </div>
                <div style={{width: '40%', minWidth: '6em'}}>
                  {
                    !isPos(amountTSD)
                      ? <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip">
                            Make sure the value &gt; 0
                          </Tooltip>
                        }
                      >
                        <div style={{display: 'inline-block', cursor: 'not-allowed'}}>
                          <Button
                            style={{pointerEvents: 'none'}}
                            wide
                            icon={<IconArrowUp/>}
                            label="Get UNI-V2"
                            disabled={!isPos(amountTSD)}
                          />
                        </div>
                      </OverlayTrigger>
                      : <Button
                        wide
                        icon={<IconArrowUp/>}
                        label="Get UNI-V2"
                        onClick={() => buyUniV2(user, toBaseUnitBN(amountTSD, TSD.decimals), TSD.addr)}
                      />
                  }
                </div>
              </div>
              : <Button
                className="mt-2"
                wide
                icon={<IconCirclePlus/>}
                label="Approve"
                onClick={() => {
                  approveTSD(TSD.addr, ZAP.addr);
                }}
                disabled={user === ''}
              />
          }
        </div>
      </div>
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{opacity: 0.5}}>Save some gas by Zapping your USDC directly to UNI-V2 of USDC-TSD pair with 1-click.</span>
      </div>
    </Box>
  );
}

export default AddUni;