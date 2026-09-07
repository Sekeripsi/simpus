"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Info, Settings, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  userName?: string | null;
  userRole?: string | null;
}

export function ProfileDropdown({ userName, userRole }: ProfileDropdownProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    // TODO: Call external auth service logout endpoint
    window.location.href = "/login";
  };

  const displayName = userName || "User";
  const displayRole = userRole || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto flex items-center gap-3 px-3 py-2 md:px-4 md:py-2 rounded-xl transition-all duration-200 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 group"
          >
            {/* Avatar */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-all duration-200">
              {initials}
            </div>

            {/* User Info (hidden on mobile) */}
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
            </div>

            {/* Chevron Icon */}
            <Icon
              icon={ChevronDown}
              size="sm"
              className={cn(
                "text-gray-600 transition-transform duration-300 hidden sm:block",
                isProfileOpen && "rotate-180"
              )}
            />
          </Button>
        }
      />

      <DropdownMenuContent
        align="end"
        className="w-72 overflow-hidden rounded-2xl p-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl"
      >
        {/* Profile Header Section */}
        <div className="bg-linear-to-r from-blue-600/10 to-cyan-500/10 px-6 py-5 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-600 capitalize truncate">{displayRole}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <DropdownMenuItem
            onClick={() => setIsProfileOpen(false)}
            className="px-6 py-3 text-sm text-gray-700 focus:bg-gray-50/80 transition-colors duration-150"
          >
            <Icon icon={Info} size="sm" className="text-gray-400" />
            <span className="font-medium">View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsProfileOpen(false)}
            className="px-6 py-3 text-sm text-gray-700 focus:bg-gray-50/80 transition-colors duration-150"
          >
            <Icon icon={Settings} size="sm" className="text-gray-400" />
            <span className="font-medium">Settings</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0 bg-gray-200/50" />

        {/* Logout Button */}
        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
          className="px-6 py-3 text-sm font-medium focus:bg-red-50/80"
        >
          <Icon icon={LogOut} size="sm" className="text-red-500" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
