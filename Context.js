handleToolboxContext()

const modifier = (text) => {
  text = insertFloatingPrompt(text)
  return { text, stop }
}

modifier(text)
