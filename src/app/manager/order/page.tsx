"use client";

import useToastHandler from "@/lib/toastHanlder";
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/manager/confirmDialog";
import LoadingAnimation from "@/components/manager/loadingAnimation";
import { OrderResponse, OrderStatus, UpdateOrderRequest } from "@/interfaces/order";
import OrderCard from "@/components/manager/orderCard";
import { useGetOrdersByStatus ,useUpdateOrder} from "@/api/manager/useOrder";
import { useGetTableById, useGetTables } from "@/api/manager/useTable";
import { BaseTableResponse } from "@/interfaces/table";
import DateTimeDisplay from "@/components/manager/clock";

interface PreparingOrderWithTable extends OrderResponse {
  table: BaseTableResponse;
}

export default function OrderPage() {
  const toaster = useToastHandler();
  const updateOrder = useUpdateOrder();
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tables, isLoading: loadingTables, refetch: refetchTables } = useGetTables();
  const {data: preparingOrders =[], isLoading: loadingPreparingOrders,refetch: refetchPreparingOrders } = useGetOrdersByStatus(OrderStatus.Preparing);
  
  const [orderData, setOrderData] = useState<UpdateOrderRequest>();

  if (!tables) {
    return;
  }

  const preparingOrdersWithTable: PreparingOrderWithTable[] = preparingOrders.map((order) => {
    const table = tables.find((table) => table.id === order.tableId);
    return { ...order, table: table! };
  });
  
  // Filter orders by table name based on search term
  const filteredOrders = preparingOrdersWithTable.filter((order) => 
    order.table.tableName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingPreparingOrders || loadingTables) {
    return <LoadingAnimation/>
  }

  const updateOrderHandler = async (orderID :string) => {
    const updateOrderData: UpdateOrderRequest = {
      status: OrderStatus.Served,
      table_id: orderID
    };

    setOrderData(updateOrderData);
    setOpenDialog(true);
  };

  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-row justify-between">
        <label className="input input-bordered flex items-center gap-2 rounded-xl">
          <input type="text" className="grow" placeholder="Search Table" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="font-bold text-xl items-center flex px-5 rounded-lg border-2 border-primary">
          <DateTimeDisplay/>
        </div>
      </div>
      <div>
        {filteredOrders.map((pot: PreparingOrderWithTable) => (
          <div key={pot.id} className="flex flex-col items-center gap-3">
            <div className="flex flex-row items-center w-full mt-10">
              <div className="w-full font-bold px-2">
                <div>Table NO: {pot.table.tableName}</div>
                <div>Order Since: {formatDate(pot.createdAt)}</div>
                <div>Order Status: {pot.status}</div>
              </div>
              <div
                className="btn btn-success text-white font-bold text-lg"
                onClick={() => updateOrderHandler(pot.id)}
              >
                Deliver
              </div>
            </div>
            <div 
              className="w-[54rem] text-whereBlack overflow-x-scroll border-2 rounded-lg"
              style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
              }}
            >
              <div className="flex flex-row gap-1" style={{ width: "max-content" }}>
                {pot.orderItem?.map((item) => (
                  <OrderCard key={item.id} orderItem={item} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog openDialog={openDialog} setOpenDialog={setOpenDialog} title="ยืนยันการจัดส่งอาหาร?" description="แน่ใจหรือไม่ว่าต้องการจัดส่งอาหาร" callback={async () =>{ 
          await updateOrder.mutateAsync(orderData!);
          toaster("ส่งออเดอร์สำเร็จ", "คุณทำการส่งออเดอร์สำเร็จ");
          setOpenDialog(false);      
          refetchPreparingOrders();
      }} />
    </div>
  );
}
