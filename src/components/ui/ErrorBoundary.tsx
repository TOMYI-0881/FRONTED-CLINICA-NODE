import { Component, type ErrorInfo, type PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";

interface State {
  hasError: boolean;
}

// Evita que un error puntual (render, efecto, WS, etc.) desmonte el árbol
// completo de React y deje la pantalla en blanco.
export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 grid place-items-center bg-background p-4">
          <div className="w-full max-w-md rounded-[26px] border border-frost-edge bg-card p-8 text-center shadow-xl backdrop-blur-xl">
            <h1 className="font-display text-2xl font-extrabold">
              Ups, algo salió mal
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ocurrió un error inesperado. Recargá la página para continuar.
            </p>
            <Button
              className="mt-6 w-full rounded-full"
              onClick={() => window.location.reload()}
            >
              Recargar
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}