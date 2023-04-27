export interface TimeCondition {
    type: 'Time';
    // The condition is considered met if the current time meets or exceeds `timeAfterEpochSec`.
    // This timestamp threshold is specified as the number of seconds since UNIX epoch.
    timeAfterEpochSec: number;
}

export interface TokenAmountCondition {
    type: 'TokenAmount';
    // The condition is considered met if the specified token has a zero (principal) amount in the position.
    // `zeroAmountToken` can only be either 0 or 1, representing token0 or token1 in the position, respectively.
    // For example, if `zeroAmountToken` is 1, then the condition is considered met if token1 in the position is exactly zero.
    // Note that only the principal amount is considered; accrued fees are not.
    zeroAmountToken: number;
}

export interface PriceCondition {
    type: 'Price';
    // Exactly one of `gte` and `lte` should be defined; the other must be `undefined`.
    // The defined float value represents the price threshold to compare against.
    // If `gte` is set, the condition is considered met if the current price >= `gte`.
    // Otherwise, the condition is considered met if the current price <= `lte`.
    gte?: number;
    lte?: number;
    // If set, the condition is only considered met if the price remains satisfaction the threshold requirement for at least the past `durationSec` seconds.
    // For example, if `gte` is 10 and `durationSec` is set to 3600, then the condition is only considered met if the price remains >= 10 for the entire past hour.
    // The historical price feed used is Coingecko.
    durationSec?: number;
}

export type Condition = TimeCondition | TokenAmountCondition | PriceCondition;

// Close a position, and send both tokens (principal and collected fees) to the position owner.
export interface CloseAction {
    type: 'Close';
    // A number between 0 and 1, inclusive. Digits after the sixth decimal point are ignored, i.e. the precision is 0.000001.
    slippage: number;
    // Aperture deducts tokens from the position to cover the cost of performing this action (gas).
    // The `maxGasProportion` value represents the largest allowed proportion of the position value to be deducted.
    // For example, a `maxGasProportion` of 0.10 represents 10% of the position, i.e. no more than 10% of the position's tokens (principal and accrued fees) may be deducted.
    // If network gas price is high and the deduction would exceed the specified ceiling, then the action will not be triggered.
    maxGasProportion: number;
}

// Same as 'Close' but the position serves a limit order placed on Aperture.
// No slippage needs to be specified as limit order positions are always closed with a zero slippage setting.
export interface LimitOrderCloseAction {
    type: 'LimitOrderClose';
    // See above.
    maxGasProportion: number;
}

// Claims accrued fees, swap them to the same ratio as the principal amounts, and add liquidity.
export interface ReinvestAction {
    type: 'Reinvest';
    // See above.
    slippage: number;
    // See above.
    maxGasProportion: number;
}

// Close a position, and swap tokens (principal and collected fees) to the ratio required by the specified new price range, and open a position with that price range.
export interface RebalanceAction {
    type: 'Rebalance';
    // The lower and upper ticks of the specified new price range.
    tickLower: number;
    tickUpper: number;
    // See above.
    slippage: number;
    // See above.
    maxGasProportion: number;
}

type Action = CloseAction | LimitOrderCloseAction | ReinvestAction | RebalanceAction;

export interface Payload {
    ownerAddr: string;
    chainId: number;
    nftId: number;
    condition: Condition;
    action: Action;
}

// See https://eips.ethereum.org/EIPS/eip-4494 for information on the "permit" approval flow.
export interface PermitInfo {
    // A raw signature that can be generated by https://docs.ethers.org/v5/api/signer/#Signer-signTypedData.
    signature: string;
    // Unix timestamp in seconds.
    deadline: number;
}

export interface CreateTriggerRequest {
    payload: Payload;
    payloadSignature: string;
    // If Aperture doesn't already have authority over the position specified in `payload`, then `permitInfo` should be obtained from the user and populated here.
    permitInfo?: PermitInfo;
}

export interface GenericResponse {
    body: JSON;
}

export interface ListTriggerRequest {
    ownerAddr: string;
    chainId: number;
    isLimitOrder: boolean;
}

export enum Status {
    CREATED = 'CREATED',
    STARTED = 'STARTED',
    COMPLETED = 'COMPLETED',
    INVALID = 'INVALID',
}

export interface ListTriggerResponse {
    ownerAddr: string;
    taskId: number;
    chainId: number;
    nftId: number;
    status: Status;
    lastUpdatedSec: number;
}

export interface DeleteTriggerRequest {
    ownerAddr: string;
    taskId: number;
    payloadSignature: string;
}
