import * as React from "react"
import { cn } from "@/utils/cn"
import { Loader2 } from "lucide-react"

const Textarea = React.forwardRef(({ className, loading = false, ...props }, ref) => {
  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-input/80 focus:border-ring resize-none",
          loading && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
      {loading && (
        <div className="absolute right-3 top-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea } 