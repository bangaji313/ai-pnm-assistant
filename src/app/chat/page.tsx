import { Suspense } from "react";
import { Chat } from "@/components/chat";
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="loading-page">
          Menyiapkan ruang percakapan…
        </main>
      }
    >
      <Chat />
    </Suspense>
  );
}
