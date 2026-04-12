import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import toast from "react-hot-toast"
import { useShoppingList } from "./hooks"
import { shoppingListsApi } from "./api"
import ConfirmDialog from "@/components/ConfirmDialog"

interface Props {
  listId: string
}

export default function ShoppingListDetail({ listId }: Props) {
  const { list, loading, error, toggleItem } = useShoppingList(listId)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-gray-400 text-sm">
        Chargement...
      </div>
    )
  }

  if (error || !list) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-red-500 text-sm">
        {error ?? "Liste introuvable"}
      </div>
    )
  }

  const checkedCount = list.items.filter((i) => i.checked).length
  const totalCount = list.items.length

  function exportList() {
    const lines = [
      `${list!.name}`,
      "",
      ...list!.items.map((item) => {
        const qty = item.quantity ? `${item.quantity}` : ""
        const unit = item.unit ? ` ${item.unit}` : ""
        const check = item.checked ? "✓ " : "• "
        return `${check}${qty}${unit}${qty || unit ? " " : ""}${item.name}`
      })
    ]
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => {
        toast.success("Liste copiée dans le presse-papiers")
      })
      .catch(() => {
        toast.error("Impossible de copier dans le presse-papiers")
      })
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await shoppingListsApi.remove(listId)
      toast.success("Liste supprimée")
      void navigate({ to: "/shopping-lists" })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur")
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-1">
            {list.name}
          </h1>
          <p className="text-sm text-gray-400">
            {checkedCount}/{totalCount} article{totalCount !== 1 ? "s" : ""}{" "}
            coché{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={exportList}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:border-warm-300 hover:text-warm-600 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Copier
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Supprimer
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
          <div
            className="bg-warm-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`
            }}
          />
        </div>
      )}

      {/* Items */}
      {list.items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          Aucun ingrédient dans cette liste.
        </p>
      ) : (
        <ul className="space-y-2">
          {list.items.map((item) => (
            <li key={item._id}>
              <label
                className={`flex items-center gap-3 px-4 py-3 bg-white border rounded-xl cursor-pointer transition-all duration-150 ${
                  item.checked
                    ? "border-gray-100 opacity-50"
                    : "border-gray-100 hover:border-warm-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => void toggleItem(item._id, e.target.checked)}
                  className="w-4 h-4 rounded accent-warm-600 cursor-pointer"
                />
                <span
                  className={`text-sm flex-1 ${item.checked ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                  {item.quantity ? (
                    <span className="font-medium text-gray-800">
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}{" "}
                    </span>
                  ) : null}
                  {item.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {showDeleteDialog && (
        <ConfirmDialog
          title="Supprimer la liste"
          message={`Voulez-vous vraiment supprimer "${list.name}" ? Cette action est irréversible.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  )
}
