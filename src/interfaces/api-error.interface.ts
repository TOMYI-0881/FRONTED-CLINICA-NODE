export interface ApiErrorDetail {
  path: (string | number)[];
  message: string;
  code: string;
}

export interface ApiError {
  error: string;
  details?: ApiErrorDetail[];
}
