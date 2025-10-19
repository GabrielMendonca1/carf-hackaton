import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { auth } from "../../(auth)/auth";
import { PerformanceDashboard } from "@/components/performance-dashboard";

export const metadata = {
  title: "Performance | CARF",
  description: "Análise de performance e métricas",
};

export default async function PerformancePage() {
  const session = await auth();

  if (!session) {
    redirect(`/login?redirectUrl=${encodeURIComponent("/performance")}`);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <AppHeader />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <PerformanceDashboard />
        </div>
      </main>
    </div>
  );
}
