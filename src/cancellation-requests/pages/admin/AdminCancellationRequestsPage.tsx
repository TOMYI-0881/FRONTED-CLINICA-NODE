import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTimeLocal } from "@/lib/format-date";
import { useCancellationRequests } from "@/cancellation-requests/hooks/useCancellationRequests";
import { Check, X } from "lucide-react";

export const AdminCancellationRequestsPage = () => {
  const { data: requests, isLoading, approve, reject } = useCancellationRequests();

  return (
    <div className="p-4 md:p-8">
      <AdminTitle
        title="Pedidos de cancelación"
        description="Bandeja de pedidos pendientes hechos por doctores."
      />

      <div className="mt-6 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}

        {!isLoading && requests?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay pedidos pendientes.
          </p>
        )}

        {requests?.map((request) => (
          <Card key={request.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Cita {request.appointmentId}
                </p>
                <p className="text-sm text-foreground">{request.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Pedido el {formatDateTimeLocal(request.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  onClick={() => approve.mutate(request.id)}
                  disabled={approve.isPending || reject.isPending}
                >
                  <Check className="size-4" />
                  Aprobar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reject.mutate(request.id)}
                  disabled={approve.isPending || reject.isPending}
                >
                  <X className="size-4" />
                  Rechazar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
