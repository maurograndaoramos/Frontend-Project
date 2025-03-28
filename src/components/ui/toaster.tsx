"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/context/CartContext"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()
  const { cart } = useCart()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              cart.isOpen && "hidden sm:flex"
            )}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className={cn(
        "fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        cart.isOpen && "sm:right-[448px]"
      )} />
    </ToastProvider>
  )
}