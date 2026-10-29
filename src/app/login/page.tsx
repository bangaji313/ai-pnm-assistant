import { Suspense } from "react";
import { Login } from "@/components/login";
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="loading-page">
          Menyiapkan halaman masuk…
        </main>
      }
    >
      <Login />
    </Suspense>
  );
}
