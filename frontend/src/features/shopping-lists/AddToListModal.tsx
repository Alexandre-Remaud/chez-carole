import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useShoppingLists } from "./hooks"

interface Props {
  recipe: { _id: string; title: string; servings?: number }
  onClose: () => void
}

export default function AddToListModal({ recipe, onClose }: Props) {
  const { lists, loading, createList, addRecipeToList } = useShoppingLists()
  const [view, setView] = useState<"select" | "create">("select")
  const [newListName, setNewListName] = useState("")
  const [servings, setServings] = useState(recipe.servings ?? 4)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && lists.length === 0) setView("create")
  }, [loading, lists.length])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  async function handleAddToExisting(listId: string) {
    setSubmitting(true)
    try {
      await addRecipeToList(listId, {
        recipeId: recipe._id,
        servings: servings !== (recipe.servings ?? 4) ? servings : undefined
      })
      const listName = lists.find((l) => l._id === listId)?.name ?? "la liste"
      toast.success(`Ajouté à ${listName}`)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newListName.trim()) return
    setSubmitting(true)
    try {
      await createList({
        name: newListName.trim(),
        recipeIds: [recipe._id],
        servingsOverrides:
          servings !== (recipe.servings ?? 4)
            ? [{ recipeId: recipe._id, servings }]
            : undefined
      })
      toast.success(`Liste "${newListName.trim()}" créée`)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-list-title"
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="add-to-list-title"
            className="font-display text-lg font-semibold text-gray-800"
          >
            Liste de courses
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Servings adjuster */}
        <div className="flex items-center gap-3 mb-5 bg-warm-50 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-600 flex-1">
            Portions pour <span className="font-medium">{recipe.title}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-gray-800">
              {servings}
            </span>
            <button
              type="button"
              onClick={() => setServings((s) => s + 1)}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              +
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Chargement...
          </p>
        ) : view === "select" ? (
          <div className="space-y-2">
            {lists.map((list) => (
              <button
                key={list._id}
                type="button"
                onClick={() => handleAddToExisting(list._id)}
                disabled={submitting}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-warm-300 hover:bg-warm-50 transition-all duration-150 disabled:opacity-50"
              >
                <p className="text-sm font-medium text-gray-800">{list.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {list.items.length} ingrédient
                  {list.items.length !== 1 ? "s" : ""}
                </p>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setView("create")}
              className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-gray-200 hover:border-warm-400 hover:bg-warm-50 transition-all duration-150 text-sm text-gray-500 hover:text-warm-600 flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Créer une nouvelle liste
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            {lists.length > 0 && (
              <button
                type="button"
                onClick={() => setView("select")}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-1"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Retour
              </button>
            )}
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nom de la liste"
              maxLength={100}
              autoFocus
              className="input-field"
            />
            <button
              type="submit"
              disabled={submitting || !newListName.trim()}
              className="w-full py-2.5 text-sm font-medium text-white bg-warm-600 rounded-xl hover:bg-warm-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Création..." : "Créer et ajouter"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
