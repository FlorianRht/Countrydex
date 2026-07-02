import { Header } from "@/components/Header";
import { DexView } from "@/components/DexView";

export default function DexPage() {
  return (
    <main className="min-h-screen w-full px-5 py-8 sm:px-8 lg:px-10">
      <Header />
      <DexView />
    </main>
  );
}
