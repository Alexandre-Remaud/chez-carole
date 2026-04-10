import toast from "react-hot-toast"

export function useShare(title: string, description: string, url: string) {
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share

  async function share() {
    if (canNativeShare) {
      try {
        await navigator.share({ title, text: description, url })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(url)
        }
      }
    } else {
      await copyToClipboard(url)
    }
  }

  return { share, canNativeShare }
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
  toast.success("Lien copié !")
}
