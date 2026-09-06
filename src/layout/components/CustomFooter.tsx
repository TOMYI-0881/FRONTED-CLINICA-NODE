import { CustomLogo } from "@/components/custom/CustomLogo";

export const CustomFooter = () => {
  return (
    <footer className="border-t py-12 px-4 lg:px-8 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <CustomLogo />
            <p className="text-sm text-muted-foreground mt-2">
              Reservá turnos con nuestros doctores y seguí la cola de espera
              del día en tiempo real.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Pacientes</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-foreground">
                  Ver doctores
                </a>
              </li>
              <li>
                <a href="/appointments/mine" className="hover:text-foreground">
                  Mis turnos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Sistema de Reservas Clínicas.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
