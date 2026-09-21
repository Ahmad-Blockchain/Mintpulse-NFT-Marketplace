export interface WalletRequestBody {

    wallet: string;

}

export interface SignatureRequestBody {

    wallet: string;

    signature: string;

}

// Aliases for readability

export type NonceRequestBody =
    WalletRequestBody;

export type LoginRequestBody =
    SignatureRequestBody;

export type VerifySignatureBody =
    SignatureRequestBody;