export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Primary: Web API
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: execCommand (deprecated but works)
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch (error) {
    console.error("Context Crafter: Clipboard write failed:", error);
    return false;
  }
}
