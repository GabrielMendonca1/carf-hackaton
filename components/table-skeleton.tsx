import { Skeleton } from "./ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              {[...Array(7)].map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y bg-background">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-center">
                  <Skeleton className="h-6 w-6 mx-auto" />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-20" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-32 rounded-md" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
