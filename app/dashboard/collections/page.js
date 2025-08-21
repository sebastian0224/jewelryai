export default function CollectionsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Colecciones
        </h1>
        <p className="text-muted-foreground text-lg">
          Organiza tus proyectos en colecciones temáticas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Anillos de Compromiso",
          "Collares Elegantes",
          "Pulseras Modernas",
          "Aretes Clásicos",
        ].map((collection, index) => (
          <div
            key={index}
            className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold text-card-foreground">
                {collection}
              </h3>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {Math.floor(Math.random() * 20) + 5} fotos
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3].map((img) => (
                <div
                  key={img}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">IMG</span>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground text-sm">
              Última actualización hace 3 días
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
