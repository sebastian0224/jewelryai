// app/dashboard/page.js
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              ¡Bienvenido a JewelryAI!
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Hola{" "}
              <span className="font-semibold text-amber-600">
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
              </span>
              , estás listo para transformar tus fotos de joyería con IA.
            </p>

            {/* User Info Card */}
            <div className="bg-slate-50 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                {user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-slate-600">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-sm text-amber-800">
                  Plan: <span className="font-semibold">Free</span>
                </p>
                <p className="text-sm text-amber-800">
                  Imágenes disponibles:{" "}
                  <span className="font-semibold">5/5</span>
                </p>
              </div>
            </div>

            {/* Coming Soon */}
            <div className="mt-8">
              <p className="text-slate-500 italic">
                Funcionalidades de procesamiento de imágenes próximamente...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
