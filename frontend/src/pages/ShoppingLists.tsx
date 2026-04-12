import { Link } from "@tanstack/react-router"
import { useShoppingLists } from "@/features/shopping-lists/hooks"

export default function ShoppingLists() {
  const { lists, loading, error } = useShoppingLists()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-gray-400 text-sm">
        Chargement...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-red-500 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-6 h-px bg-warm-400" />
        <h1 className="font-display text-2xl font-bold text-gray-800">
          Mes listes de courses
        </h1>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto mb-4 text-warm-200"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-gray-500 text-sm mb-1">Aucune liste de courses</p>
          <p className="text-gray-400 text-xs">
            Ajoutez une recette depuis une{" "}
            <Link to="/recipes" className="text-warm-600 hover:underline">
              fiche recette
            </Link>
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {lists.map((list) => {
            const checked = list.items.filter((i) => i.checked).length
            const total = list.items.length
            return (
              <li key={list._id}>
                <Link
                  to="/shopping-lists/$id"
                  params={{ id: list._id }}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-warm-200 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm group-hover:text-warm-700 transition-colors truncate">
                      {list.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {checked}/{total} article{total !== 1 ? "s" : ""}
                      {" · "}
                      {new Date(list.updatedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short"
                      })}
                    </p>
                  </div>
                  {total > 0 && (
                    <div className="ml-4 w-24 shrink-0">
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-warm-400 h-1 rounded-full transition-all"
                          style={{ width: `${(checked / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
