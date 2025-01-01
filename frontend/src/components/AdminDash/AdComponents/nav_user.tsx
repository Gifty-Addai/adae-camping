"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LoaderIcon,
  LogOut,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {  useSelector} from "react-redux";
import { RootState } from "@/core/store/store";
import { logout } from "@/core/store/slice/user_slice";
import { useAppDispatch } from "@/core/constants";
import { useNavigate } from "react-router-dom";

export function NavUser() {
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { user, status, error } = useSelector((state: RootState) => state.userSlice);

  const handleLogout = () => {
      dispatch(logout()).unwrap();
      navigate("/admin/signin");
    
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`https://github.com/shadcn.png`}
                  alt={user?._id}
                />
                <AvatarFallback className="rounded-lg font-bold">{`${user?.name}`}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm text-sidebar-foreground leading-tight">
                <span className="truncate font-semibold">
                  {user?.name || "Guest"}
                </span>
                <span className="truncate text-xs">
                  {user?._id || `Add phone number`}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`https://github.com/shadcn.png`}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Guest"}
                  </span>
                  
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={status === 'loading'} onClick={handleLogout}>
                {status === 'loading' ? <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {error && (
              <>
                <DropdownMenuSeparator />
                <div className="px-4 py-2 text-red-500 text-sm">
                  {error}
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
