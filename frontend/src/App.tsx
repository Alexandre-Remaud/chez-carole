import RecipeForm from "./components/RecipeForm"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
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
          <h1 className="font-display text-2xl font-bold text-gray-800">
            Chez Carole
          </h1>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6">
        <RecipeForm />
      </main>

      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-100">
        Chez Carole — Vos recettes, simplement.
      </footer>
    </div>
  )
}

export default App
