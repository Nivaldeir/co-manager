"use client";

import { useState } from "react";
import { ChevronDown, EyeOff, Type, Languages, User, Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/src/shared/utils";
import { Button } from "./ui";

type AccountType = "pix" | "crypto";

interface Account {
  id: string;
  name: string;
  lastDigits: string;
  type: AccountType;
}

type NotificationCategory = "pix-received" | "pix-sent" | "report" | "payment-link" | "security";

interface Notification {
  id: string;
  title: string;
  description: string;
  timeLabel: string;
  category: NotificationCategory;
  read: boolean;
}

const accounts: Account[] = [
  {
    id: "transactional-pix",
    name: "Conta Transacional Pix",
    lastDigits: "2847",
    type: "pix",
  },
  {
    id: "operational",
    name: "Conta Operacional",
    lastDigits: "1234",
    type: "pix",
  },
  {
    id: "crypto-otc",
    name: "Conta Cripto OTC",
    lastDigits: "5678",
    type: "crypto",
  },
];

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Pix recebido",
    description: "Você recebeu um Pix de R$ 1.250,00.",
    timeLabel: "Agora",
    category: "pix-received",
    read: false,
  },
  {
    id: "2",
    title: "Pix enviado",
    description: "Transferência concluída com sucesso.",
    timeLabel: "2h",
    category: "pix-sent",
    read: false,
  },
  {
    id: "3",
    title: "Relatório disponível",
    description: "Seu PDF de relatórios foi gerado.",
    timeLabel: "Ontem",
    category: "report",
    read: true,
  },
  {
    id: "4",
    title: "Link de pagamento",
    description: "Novo link criado e ativo.",
    timeLabel: "Ontem",
    category: "payment-link",
    read: true,
  },
  {
    id: "5",
    title: "Segurança",
    description: "Login realizado em novo dispositivo.",
    timeLabel: "3d",
    category: "security",
    read: true,
  },
];

function getAccountTag(type: AccountType) {
  if (type === "crypto") {
    return {
      label: "Cripto",
      className: "bg-[#f3e8ff] text-[#7e22ce]",
    };
  }

  return {
    label: "Pix",
    className: "bg-[#e0ecff] text-[#2563eb]",
  };
}

function getNotificationAccentClasses(category: NotificationCategory) {
  if (category === "pix-received") {
    return "bg-[#dcfce7] text-[#16a34a]";
  }

  if (category === "pix-sent") {
    return "bg-[#e0ecff] text-[#2563eb]";
  }

  if (category === "report") {
    return "bg-[#fef3c7] text-[#92400e]";
  }

  if (category === "payment-link") {
    return "bg-[#fef9c3] text-[#92400e]";
  }

  return "bg-[#e5e7eb] text-[#374151]";
}

export function Header() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => (notification.read ? notification : { ...notification, read: true }))
    );
  };

  return (
    <header className="h-[56px] relative shrink-0 w-full border-b border-[#E5E7EB] bg-white">
      <div className="flex items-center justify-between px-[10px] pr-6 py-0 h-full gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="rounded-none bg-transparent border-none gap-4 items-center hover:bg-transparent hover:border-none"
              variant="outline"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] leading-[14px] font-medium tracking-[0.08em] text-[#9CA3AF] uppercase">
                  Conta
                </span>
                <span className="text-sm leading-[18px] font-medium text-[#111827]">
                  {selectedAccount?.name}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#6B7280] shrink-0 mt-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={8} className="w-[320px] p-2">
            <div className="backdrop-blur-sm rounded-[14px]">
              <h3 className="text-xs font-medium mb-2 p-2">
                Seleção de Contas
              </h3>
              <div className="bg-white rounded-[12px] overflow-hidden w-full flex flex-col gap-1">
                {accounts.map((account) => {
                  const tag = getAccountTag(account.type);
                  const isActive = account.id === selectedAccountId;

                  return (
                    <Button
                      key={account.id}
                      variant="outline"
                      className="w-full p-2 rounded-[2px] h-[60px] hover:border-none flex items-center justify-between"
                      onClick={() => setSelectedAccountId(account.id)}
                    >
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-[#2563EB]" : "text-[#111827]"
                          )}
                        >
                          {account.name}
                        </span>
                        <span className="text-[11px] tracking-[0.16em]">
                          •••• {account.lastDigits}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center justify-center px-3 h-[22px] rounded-full text-[11px] font-medium",
                          tag.className
                        )}
                      >
                        {tag.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-4 ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="relative rounded-none bg-transparent border-none hover:bg-transparent hover:border-none"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-[4px] rounded-full bg-[#FACC15] text-[10px] font-semibold text-[#1F2937] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8} className="w-[320px] p-0 border-none shadow-lg rounded-[14px]">
              <div className="bg-white rounded-[14px] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-[#111827]">
                      Notificações
                    </span>
                    <span className="text-[11px] font-medium text-[#6B7280] bg-[#F3F4F6] rounded-full px-2 py-[2px]">
                      {notifications.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] font-medium text-[#2563EB] hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                </div>

                <div className="max-h-[320px] overflow-y-auto py-1">
                  {notifications.map((notification) => {
                    const accentClasses = getNotificationAccentClasses(notification.category);

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                          "hover:bg-[#F9FAFB]"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold",
                            accentClasses
                          )}
                        >
                          {notification.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span
                              className={cn(
                                "text-[13px] font-semibold truncate",
                                notification.read ? "text-[#4B5563]" : "text-[#111827]"
                              )}
                            >
                              {notification.title}
                            </span>
                            <span className="text-[11px] text-[#9CA3AF] shrink-0">
                              {notification.timeLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B7280] leading-[1.4] line-clamp-2">
                            {notification.description}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#FACC15]" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#E5E7EB] px-4 py-2.5">
                  <Button
                    variant="outline"
                    className="w-full h-8 rounded-[999px] border-[#E5E7EB] text-[12px] font-medium text-[#111827] bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:border-[#D1D5DB]"
                  >
                    Ver todas
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="rounded-none bg-transparent border-none hover:bg-transparent hover:border-none"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-none bg-transparent border-none hover:bg-transparent hover:border-none"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="rounded-none bg-transparent border-none hover:bg-transparent hover:border-none"
          >
            <Languages className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 pl-3 ml-1 border-l border-[#E5E7EB]">
            <Button
              variant="outline"
              className="rounded-none bg-transparent border-none hover:bg-transparent hover:border-none"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-none bg-transparent border-none hover:bg-transparent hover:border-none"
            >
              Leandro Mutual
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}