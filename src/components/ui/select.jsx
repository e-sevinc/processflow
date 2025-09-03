import * as React from "react"
import { cn } from "@/utils/cn"
import { ChevronDown, Loader2 } from "lucide-react"

// Main Select component (wrapper)
const Select = React.forwardRef(({ className, children, loading = false, disabled, ...props }, ref) => {
  return (
    <div className={cn("relative", className)} ref={ref} {...props}>
      {children}
    </div>
  )
})
Select.displayName = "Select"

// Select trigger (the clickable button)
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-input/80 focus:border-ring",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

// Select value (displays the selected value)
const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
  return (
    <span
      className={cn("block truncate", className)}
      ref={ref}
      {...props}
    >
      {props.children || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

// Select content (dropdown container)
const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        className
      )}
      ref={ref}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

// Select item (individual option)
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

// Legacy Select component for backward compatibility
const LegacySelect = React.forwardRef(({ className, children, loading = false, disabled, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-input/80 focus:border-ring appearance-none cursor-pointer",
          loading && "pr-10",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  )
})
LegacySelect.displayName = "LegacySelect"

// Legacy SelectOption for backward compatibility
const SelectOption = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <option
      className={cn("py-2", className)}
      ref={ref}
      {...props}
    >
      {children}
    </option>
  )
})
SelectOption.displayName = "SelectOption"

export { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem, 
  LegacySelect as SimpleSelect,
  SelectOption 
}