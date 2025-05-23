import { Suspense } from "react";
import TicketClient from "./TicketClient";

// Force dynamic rendering to avoid prerendering
export const dynamic = 'force-dynamic';

export default function RecipientPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketClient />
    </Suspense>
  );
}