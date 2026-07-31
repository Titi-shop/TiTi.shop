export {};

declare global {
  interface PiInitOptions {
    version: string;
    sandbox: boolean;
  }

  interface PiAuthResult {
    accessToken: string;
    user?: {
      uid: string;
      username: string;
    };
  }

  interface PiIncompletePayment {
    identifier?: string;
    amount?: number;
    memo?: string;
    metadata?: Record<string, unknown>;
    transaction?: {
      txid?: string;
    };
    [key: string]: unknown;
  }

  interface PiPaymentData {
    amount: number;
    memo?: string;
    metadata?: Record<string, unknown>;
  }

  type PiPaymentCallback =
    () => void;

  interface PiPaymentCallbacks {
    onReadyForServerApproval: (
      paymentId: string,
      callback?: PiPaymentCallback
    ) => void | Promise<void>;

    onReadyForServerCompletion: (
      paymentId: string,
      txid: string,
      callback?: PiPaymentCallback
    ) => void | Promise<void>;

    onCancel?: () => void;

    onError?: (
      error: unknown
    ) => void;
  }

  interface PiSignInOptions {
    clientId: string;
    redirectUri: string;
    scopes?: string[];
    state?: string;
  }

  interface PiBrowser {
    init: (
      options: PiInitOptions
    ) => void;

    authenticate: (
      scopes: string[],
      onIncompletePaymentFound?: (
        payment: PiIncompletePayment
      ) => void | Promise<void>
    ) => Promise<PiAuthResult>;

    createPayment: (
      data: PiPaymentData,
      callbacks: PiPaymentCallbacks
    ) => Promise<void>;

    signIn: (
      options: PiSignInOptions
    ) => void;

    logout?: () => void;
  }

  interface Window {
    Pi?: PiBrowser;
    __pi_initialized?: boolean;
  }
}
