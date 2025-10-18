import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { ProcessList } from "@/components/process-list";
import { mockProcessos } from "@/lib/mock-data/processos";
import { auth } from "../../(auth)/auth";

export const metadata = {
  title: "Meus Processos | CARF",
  description: "Gerencie seus processos com apoio de IA",
};

export default async function ProcessosPage() {
  const session = await auth();

  if (!session) {
    redirect(`/login?redirectUrl=${encodeURIComponent("/processos")}`);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <AppHeader />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6 lg:px-8">
          <ProcessList processos={mockProcessos} />
        </div>
      </main>
    </div>
  );
}
