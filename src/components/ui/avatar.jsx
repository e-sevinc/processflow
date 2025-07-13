import * as React from "react"
import { cn } from "@/utils/cn"

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, src, ...props }, ref) => {
  // Eğer src varsa ve geçerliyse onu kullan, yoksa varsayılan görseli kullan
  const imageSrc = src && src.trim() !== "" 
    ? src 
    : "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_hybrid&w=740"
  
  return (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      src={imageSrc}
      alt="Kullanıcı Avatarı"
      onError={(e) => {
        // Eğer yüklenen görsel yüklenemezse varsayılan görseli kullan
        e.target.src = "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_hybrid&w=740"
      }}
      {...props}
    />
  )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback } 