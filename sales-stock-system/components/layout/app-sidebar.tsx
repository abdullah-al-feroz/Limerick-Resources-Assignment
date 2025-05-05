"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Box, Home, LogOut, Package, Search, ShoppingCart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

interface AppSidebarProps {
  currentPath: string
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const router = useRouter()
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || '{"username":"User"}')
      : { username: "User" }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const isActive = (path: string) => {
    return currentPath === path
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Stock System</span>
          <SidebarTrigger className="ml-auto md:hidden" />
        </div>
        <form className="px-4 py-2">
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/products") || currentPath.startsWith("/products")}>
                  <Link href="/products">
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/sales") || currentPath.startsWith("/sales")}>
                  <Link href="/sales">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Sales</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reports/stock")}>
                  <Link href="/reports/stock">
                    <BarChart3 className="h-4 w-4" />
                    <span>Stock Report</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reports/date-wise")}>
                  <Link href="/reports/date-wise">
                    <BarChart3 className="h-4 w-4" />
                    <span>Date-wise Report</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.username}</span>
            <span className="text-xs text-muted-foreground">{user.role || "User"}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout} title="Logout">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
