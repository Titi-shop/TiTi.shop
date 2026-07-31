import type {
  RpcVerifyStage,
  RpcVerifyReason,
} from "./rpc.types";

export type InsertRpcLogInput = {
  paymentIntentId: string;
  piPaymentId: string | null;

  rpcReachable: boolean;
  confirmed: boolean;

  parseLayer: string | null;

  hasMeta: boolean;
  hasEvents: boolean;

  senderFound: boolean;
  receiverFound: boolean;
  amountFound: boolean;

  txid: string;
  verified: boolean;

  stage: RpcVerifyStage;
  reason: RpcVerifyReason | null;

  amount: number | null;
  expectedAmount: number | null;

  sender: string | null;
  receiver: string | null;
  expectedReceiver: string | null;

  amountMatch: boolean;
  receiverMatch: boolean;
  senderMatch: boolean;

  mismatchReason: string | null;
  fraudReason: string | null;

  verificationHash: string | null;

  ledger: number | null;

  txStatus: string | null;
  chainReference: string | null;

  payload: unknown;

  createdAt: string | null;

  memo: string | null;
  successful: boolean;
operationCount: number | null;

feeStroops: number | null;
feePi: number | null;

latestLedger: number | null;
oldestLedger: number | null;
applicationOrder: number | null;

sourceAccount: string | null;
memoType: string | null;

network: string | null;

expectedSender: string | null;
expectedMemo: string | null;

memoMatch: boolean | null;
memoFound: boolean | null;

verificationVersion: number | null;
verificationMethod: string | null;

verificationSnapshot: unknown;

chainPaymentAmount: number | null;
chainEventAmount: number | null;

senderBalanceDelta: number | null;
receiverBalanceDelta: number | null;

chainAmountConsensus: boolean | null;
};


export type RpcVerificationLogRow = {
  payment_intent_id: string;
  pi_payment_id: string | null;
  txid: string;

  verified: boolean;
  stage: RpcVerifyStage;
  reason: RpcVerifyReason | null;

  amount: number | null;
  expected_amount: number | null;

  sender: string | null;
  receiver: string | null;
  expected_receiver: string | null;

  amount_match: boolean;
  receiver_match: boolean;
  sender_match: boolean;

  ledger: number | null;
  tx_status: string | null;
  chain_reference: string | null;

  rpc_reachable: boolean;
  confirmed: boolean;

  parse_layer: string | null;
  has_meta: boolean;
  has_events: boolean;

  sender_found: boolean;
  receiver_found: boolean;
  amount_found: boolean;

  payload: unknown;

  created_at_chain: string | null;
  memo: string | null;

  verification_hash: string | null;

  verified_at: string | null;
  created_at: string;
  updated_at: string;
};
