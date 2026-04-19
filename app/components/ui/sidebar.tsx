import * as React from "react"
import { ChevronLeft, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

interface SidebarContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

function useSidebar() {
  const context = React.useContext(sidebarContext as React.Context<SidebarContextType>)
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar")
  }
  return context
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean
  }
>(({ className, defaultOpen = true, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <sidebarContext.Provider value={{ open, setOpen }}>
      <div
        ref={ref}
        className={cn(
          "flex h-screen w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
          !open && "w-0",
          className
        )}
        {...props}
      />
    </sidebarContext.Provider>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-b border-neutral-200 px-4 py-4 dark:border-neutral-800", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1 overflow-y-auto px-4 py-4",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border-t border-neutral-200 px-4 py-4 dark:border-neutral-800", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { open, setOpen } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {open ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full flex-col",
      className
    )}
    {...props}
  />
))
SidebarInset.displayName = "SidebarInset"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { open, setOpen } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "absolute -right-4 top-1/2 z-20 -translate-y-1/2",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {open ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4 rotate-180" />
      )}
    </Button>
  )
})
SidebarRail.displayName = "SidebarRail"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
  useSidebar,
}
