"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  FileText,
  ArrowLeftRight,
  BarChart3,
  Shield,
  Coins,
  Settings,
  Moon,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  hasDropdown?: boolean;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  {
    label: "Extrato",
    href: "/dashboard/extrato",
    icon: FileText,
    badge: 2,
    hasDropdown: true,
    subItems: [
      { label: "Consolidado", href: "/dashboard/extract" },
      { label: "Detalhado", href: "/dashboard/extract/detailed" },
    ]
  },
  { label: "Transações", href: "/dashboard/#", icon: ArrowLeftRight, badge: "1.2K" },
  { label: "Relatórios", href: "/dashboard/#", icon: BarChart3 },
  { label: "Gestão MED", href: "/dashboard/#", icon: Shield, badge: 2 },
  { label: "Cripto", href: "/dashboard/#", icon: Coins },
  { label: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (href: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const isDropdownOpen = (href: string) => openDropdowns[href] || false;

  return (
    <div className="bg-[#232f63] relative w-[239.328px] h-full flex flex-col border-r border-[rgba(255,255,255,0.1)]">
      <div className="h-[56px] border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between px-[42.53px] pr-4">
        <div className="h-[36px] flex items-center">
          <span className="text-white text-lg font-semibold">Mutual Pay</span>
        </div>
        <button className="size-[28px] flex items-center justify-center rounded-[6px] hover:bg-white/10 transition-colors">
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = isDropdownOpen(item.href);
            const isActive = (hasSubItems && item.subItems?.some(sub => pathname === sub.href));

            const itemContent = (
              <>
                <div className="flex items-center gap-[14px]">
                  <Icon className={cn("size-[18px]", isActive ? "text-white" : "text-[rgba(255,255,255,0.6)]")} />
                  <span
                    className={cn(
                      "text-[13px] font-normal font-['Montserrat',sans-serif]",
                      isActive ? "text-white" : "text-[rgba(255,255,255,0.6)]"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <div className="bg-[#d2e5ff] h-[17.5px] px-2 rounded-full flex items-center justify-center min-w-[17.5px]">
                      <span className="text-[9px] font-normal font-['Montserrat',sans-serif] text-[#232f63] leading-[13.5px]">
                        {item.badge}
                      </span>
                    </div>
                  )}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={cn(
                        "size-4 text-[rgba(255,255,255,0.6)] transition-transform duration-200",
                        isOpen && "transform rotate-180"
                      )}
                    />
                  )}
                </div>
                {!isActive && (
                  <div className="absolute left-0 top-0 h-full w-[2px] border-l-2 border-transparent rounded-[10px]" />
                )}
              </>
            );

            return (
              <div key={item.label}>
                {item.hasDropdown && hasSubItems ? (
                  <button
                    onClick={() => toggleDropdown(item.href)}
                    className={cn(
                      "w-full h-[40px] rounded-[10px] flex items-center justify-between px-[14.66px] relative transition-all",
                      isActive
                        ? "bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(210,229,255,0.1)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] border-l-2 border-[#d2e5ff]"
                        : "hover:bg-white/5"
                    )}
                  >
                    {itemContent}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "h-[40px] rounded-[10px] flex items-center justify-between px-[14.66px] relative transition-all",
                      isActive
                        ? "bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[rgba(210,229,255,0.1)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] border-l-2 border-[#d2e5ff]"
                        : "hover:bg-white/5"
                    )}
                  >
                    {itemContent}
                  </Link>
                )}

                {hasSubItems && isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems?.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "h-[36px] rounded-[8px] flex items-center px-3 transition-all",
                            isSubActive
                              ? "bg-white/10 text-white"
                              : "text-[rgba(255,255,255,0.6)] hover:bg-white/5"
                          )}
                        >
                          <ChevronRight className="size-3 mr-2" />
                          <span className="text-[12px] font-normal font-['Montserrat',sans-serif]">
                            {subItem.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.1)]">
        <div className="px-3 py-2 space-y-1">
          <button className="h-[36px] w-full rounded-[8px] flex items-center gap-[10px] px-3 hover:bg-white/5 transition-colors">
            <Moon className="size-4 text-[rgba(255,255,255,0.6)]" />
            <span className="text-[12px] font-normal font-['Montserrat',sans-serif] text-[rgba(255,255,255,0.6)]">
              Modo Escuro
            </span>
          </button>
          <button className="h-[36px] w-full rounded-[8px] flex items-center gap-[10px] px-3 hover:bg-white/5 transition-colors">
            <LogOut className="size-4 text-[rgba(255,255,255,0.6)]" />
            <span className="text-[12px] font-normal font-['Montserrat',sans-serif] text-[rgba(255,255,255,0.6)]">
              Sair
            </span>
          </button>
        </div>
        <div className="border-t border-[rgba(255,255,255,0.1)] px-3 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#d2e5ff] size-[36px] rounded-full flex items-center justify-center">
              <span className="text-[13px] font-normal font-['Montserrat',sans-serif] text-[#232f63]">
                AD
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-normal font-['Montserrat',sans-serif] text-white">
                Administrador
              </span>
              <span className="text-[10px] font-normal font-['Montserrat',sans-serif] text-[rgba(255,255,255,0.6)]">
                admin@paas.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

