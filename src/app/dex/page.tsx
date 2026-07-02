import { Header } from "@/components/Header";
import { DexView } from "@/components/DexView";

export default function DexPage() {
  return (
    <main className="dex-page min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="dex-shell mx-auto w-full max-w-[1600px]">
        <Header />
        <DexView />
      </div>
    </main>
  );
}
