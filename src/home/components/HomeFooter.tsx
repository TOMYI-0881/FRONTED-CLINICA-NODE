export const HomeFooter = () => {
  return (
    <footer
      id="ayuda"
      className="relative z-10 mt-12 border-t border-border bg-secondary/45"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground">
              T
            </span>
            <strong className="font-display">Tomy Turnos</strong>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Reservas de salud claras, humanas y cerca de vos.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Atención
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#profesionales">Reservar turno</a>
            </li>
            <li>
              <a href="#inicio">Cola en vivo</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Profesionales
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#profesionales">Especialidades</a>
            </li>
            <li>
              <a href="#profesionales">Ver doctores</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">
            Ayuda
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="mailto:hola@tomyturnos.ar">Contacto</a>
            </li>
            <li>
              <a href="#inicio">Preguntas frecuentes</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-border px-5 py-5 text-xs text-muted-foreground lg:px-8">
        © 2026 Tomy Salud. Todos los derechos reservados.
      </div>
    </footer>
  );
};