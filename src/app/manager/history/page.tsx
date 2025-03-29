"use client";

import { useGetAllPaidInvoices } from "@/api/manager/useInvoice";
import { useGetOrdersByStatus } from "@/api/manager/useOrder";
import { useGetTables } from "@/api/manager/useTable";
import { useGetInvoice } from "@/api/user/useInvoices";
import DateTimeDisplay from "@/components/manager/clock";
import HistoryCard from "@/components/manager/historyCard";
import { BaseInvoiceResponse } from "@/interfaces/invoice";
import { BaseMenuResponse } from "@/interfaces/menu";
import { OrderResponse, OrderStatus } from "@/interfaces/order";
import { BaseTableResponse } from "@/interfaces/table";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function HistoryPage() {
  const router = useRouter();
  const { data: invoices = [], isLoading: loadingInvoices } = useGetAllPaidInvoices();
  return (
    <div>
          <div className="flex flex-col gap-5">
            {invoices.map((invoice:BaseInvoiceResponse) => (
              <HistoryCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
    </div>
  );
}
