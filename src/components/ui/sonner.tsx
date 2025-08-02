import { Toaster as Sonner } from "sonner"
import * as React from "react"

interface ToasterProps {
  theme?: "light" | "dark" | "system"
  className?: string
  toastOptions?: {
    className?: string
    style?: React.CSSProperties
  }
  closeButton?: boolean
  richColors?: boolean
  expand?: boolean
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
}

const Toaster = ({ theme = "light", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
