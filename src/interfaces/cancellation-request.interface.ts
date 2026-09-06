export type CancellationRequestStatus = "pending" | "approved" | "rejected";

export interface CancellationRequest {
  id: string;
  appointmentId: string;
  requestedBy: string;
  reason: string;
  status: CancellationRequestStatus;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}
