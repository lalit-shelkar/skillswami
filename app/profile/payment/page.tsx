import { Suspense } from "react";
import PaymentStatusClient from "./PaymentStatusClient";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center text-gray-400">
          Loading payment status...
        </div>
      }
    >
      <PaymentStatusClient />
    </Suspense>
  );
}
