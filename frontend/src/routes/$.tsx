import { createFileRoute, Link } from "@tanstack/react-router"

function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <h1 className="font-display text-6xl font-bold text-warm-600 mb-4">
        404
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Oups, cette page n&apos;existe pas ou a été déplacée.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-warm-600 rounded-xl hover:bg-warm-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Voir les recettes
        </Link>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/$")({
  component: NotFound
})
