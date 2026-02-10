import { Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

export default function Layout() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <span className="text-warm-600 text-2xl" aria-hidden="true">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 11h.01" />
                    <path d="M11 15h.01" />
                    <path d="M16 16h.01" />
                    <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
                    <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
                  </svg>
                </span>
                <span className="font-display text-2xl font-bold text-gray-800">
                  Chez Carole
                </span>
              </Link>

              <nav>
                <Link
                  to="/recipes"
                  className="text-sm font-medium text-gray-600 hover:text-warm-600 transition-colors"
                >
                  Recettes
                </Link>
              </nav>
            </div>

            <Link
              to="/recipes/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-warm-600 rounded-xl hover:bg-warm-700 active:bg-warm-800 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Ajouter une recette
            </Link>
          </div>
        </header>

        <main className="flex-1 py-8 px-4 sm:px-6">
          <Outlet />
        </main>

        <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
          Chez Carole — Vos recettes, simplement.
        </footer>
      </div>
      <TanStackRouterDevtools />
    </>
  )
}
