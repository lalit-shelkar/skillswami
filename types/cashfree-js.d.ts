declare module "@cashfreepayments/cashfree-js" {
  export type CashfreeMode = "sandbox" | "production";

  export interface LoadOptions {
    mode: CashfreeMode;
  }

  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal" | string;
  }

  export interface CheckoutResult {
    error?: { message?: string };
  }

  export interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<CheckoutResult | void>;
  }

  export function load(options: LoadOptions): Promise<CashfreeInstance | undefined>;
}
