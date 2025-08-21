export default function GeneratedPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Generado
        </h1>
        <p className="text-muted-foreground text-lg">
          Todas tus imágenes generadas con IA
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border"
          >
            <div className="aspect-square bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-serif">
                Imagen {item}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-serif font-semibold text-card-foreground">
                Proyecto {item}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Generado hace 2 días
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
