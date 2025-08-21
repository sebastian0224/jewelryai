export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Inicio
        </h1>
        <p className="text-muted-foreground text-lg">
          Bienvenido a tu estudio de fotografía de joyería con IA
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h3 className="font-serif text-xl font-semibold text-card-foreground mb-4">
            Crear Nueva Sesión
          </h3>
          <p className="text-muted-foreground">
            Comienza una nueva sesión de fotografía con IA
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h3 className="font-serif text-xl font-semibold text-card-foreground mb-4">
            Proyectos Recientes
          </h3>
          <p className="text-muted-foreground">
            Accede a tus trabajos más recientes
          </p>
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h3 className="font-serif text-xl font-semibold text-card-foreground mb-4">
            Estadísticas
          </h3>
          <p className="text-muted-foreground">
            Revisa el rendimiento de tus proyectos
          </p>
        </div>
      </div>
    </div>
  );
}
