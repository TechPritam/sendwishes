import { Suspense } from "react";
import WeddingCreateClient from "./_components/WeddingCreateClient";

export default function WeddingCreatePage() {
  return (
    <Suspense fallback={null}>
      <WeddingCreateClient />
    </Suspense>
  );
}