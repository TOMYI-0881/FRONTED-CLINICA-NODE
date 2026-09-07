import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTimeLocal } from "@/lib/format-date";
import { useCancellationRequests } from "@/cancellation-requests/hooks/useCancellationRequests";
import { CalendarX2, Check, Inbox, RefreshCw, X } from "lucide-react";

export const AdminCancellationRequestsPage = () => {
  const { data: requests, isLoading, refetch, approve, reject } =
    useCancellationRequests();
  const count = requests?.length ?? 0;
  const busy = approve.isPending || reject.isPending;

  return (
    <main className="flex-1 space-y-6 p-4 md:space-y-8 md:p-8">
      <div className="flex animate-fade-up items-center justify-between gap-4">
        <AdminTitle
          title="Pedidos de cancelación"
          description={`${count} pedido${count === 1 ? "" : "s"} pendiente${
            count === 1 ? "" : "s"
          } hecho${count === 1 ? "" : "s"} por doctores.`}
        />
        <Button variant="outline" className="rounded-full" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Refrescar
        </Button>
      </div>

      <section
        className="animate-fade-up space-y-3"
        style={{ animationDelay: "80ms" }}
      >
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl"
            >
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-9 w-44 rounded-full" />
            </div>
          ))}

        {!isLoading && count === 0 && (
          <div className="flex flex-col items-center rounded-[22px] border border-frost-edge bg-card px-6 py-16 text-center shadow-sm backdrop-blur-xl">
            <span className="grid size-14 place-items-center rounded-2xl bg-coral/15 text-coral">
              <Inbox className="size-6" />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">Bandeja vacía</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No hay pedidos de cancelación pendientes por revisar.
            </p>
          </div>
        )}

        {requests?.map((request) => (
          <div
            key={request.id}
            className="flex flex-wrap items-start justify-between gap-4 rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl"
          >
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
                <CalendarX2 className="size-5" />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="font-display text-base font-bold text-foreground">
                  Pedido por {request.requestedBy}
                </p>
                <p className="text-sm text-muted-foreground">{request.reason}</p>
                <p className="text-xs text-muted-foreground">
                  Cita {request.appointmentId} · Pedido el{" "}
                  {formatDateTimeLocal(request.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => approve.mutate(request.id)}
                disabled={busy}
              >
                <Check className="size-4" />
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-destructive"
                onClick={() => reject.mutate(request.id)}
                disabled={busy}
              >
                <X className="size-4" />
                Rechazar
              </Button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};