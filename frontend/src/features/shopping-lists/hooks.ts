import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import { shoppingListsApi } from "./api"
import type {
  ShoppingList,
  AddRecipePayload,
  CreateShoppingListPayload
} from "./contract"

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await shoppingListsApi.getAll()
      setLists(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function createList(payload: CreateShoppingListPayload) {
    const list = await shoppingListsApi.create(payload)
    setLists((prev) => [list, ...prev])
    return list
  }

  async function addRecipeToList(listId: string, payload: AddRecipePayload) {
    const updated = await shoppingListsApi.addRecipe(listId, payload)
    setLists((prev) => prev.map((l) => (l._id === listId ? updated : l)))
    return updated
  }

  async function removeList(listId: string) {
    await shoppingListsApi.remove(listId)
    setLists((prev) => prev.filter((l) => l._id !== listId))
    toast.success("Liste supprimée")
  }

  return {
    lists,
    loading,
    error,
    createList,
    addRecipeToList,
    removeList,
    refresh: load
  }
}

export function useShoppingList(listId: string) {
  const [list, setList] = useState<ShoppingList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await shoppingListsApi.getOne(listId)
      setList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }, [listId])

  useEffect(() => {
    void load()
  }, [load])

  async function toggleItem(itemId: string, checked: boolean) {
    const updated = await shoppingListsApi.toggleItem(listId, itemId, checked)
    setList(updated)
  }

  return { list, loading, error, toggleItem, refresh: load }
}
