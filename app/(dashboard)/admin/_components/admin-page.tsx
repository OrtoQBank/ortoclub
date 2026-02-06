"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSignIcon,
  PercentIcon,
  UsersIcon,
  BookIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

export function AdminHub() {
  const adminPages = [

    {
      title: "Planos de Preços",
      icon: DollarSignIcon,
      href: "/admin/pricing-plans",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cupons",
      icon: PercentIcon,
      href: "/admin/coupons",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Usuários",
      icon: UsersIcon,
      href: "/admin/users",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Lista de Espera",
      icon: BookIcon,
      href: "/admin/waitlist",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Leads",
      icon: UsersIcon,
      href: "/admin/leads",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="border-b pt-12">
        <div className="p-4 pt-12 flex items-center pl-14 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administração</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-12 pb-24 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link key={page.href} href={page.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${page.bgColor}`}>
                          <Icon className={`h-6 w-6 ${page.color}`} />
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="mt-4">{page.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
