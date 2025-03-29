"use client";

import { useGetAllUnpaidInvoices, useUpdateInvoice } from "@/api/manager/useInvoice";
import { useGetMenus } from "@/api/manager/useMenu";
import { useGetOrdersByStatus } from "@/api/manager/useOrder";
import { useGetTableById } from "@/api/manager/useTable";
import { AddPointDialog } from "@/components/manager/addPointDialog";
import DateTimeDisplay from "@/components/manager/clock";
import { ConfirmDialog } from "@/components/manager/confirmDialog";
import LoadingAnimation from "@/components/manager/loadingAnimation";
import { UsePointDialog } from "@/components/manager/usePointDialog";
import { UpdateInvoiceStatusRequest } from "@/interfaces/invoice";
import { BaseMenuResponse } from "@/interfaces/menu";
import { OrderItemResponse, OrderResponse, OrderStatus } from "@/interfaces/order";
import useToastHandler from "@/lib/toastHanlder";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MdTableBar } from "react-icons/md";
import { PiPrinterFill } from "react-icons/pi";
import { useUpdateLeftoverFood } from "@/api/manager/useInvoice";

interface PaymentDetailPageProps {
  params: {
    id: string;
  };
}

interface OrderItemWithMenu extends OrderItemResponse {
  menu: BaseMenuResponse | null;
}

export default function PaymentDetailPage({ params }: PaymentDetailPageProps) {

  const { id } = params;
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddpointDialog, setOpenAddPointDialog] = useState(false);
  const [openUsePointDialog, setOpenUsePointDialog] = useState(false);
  const toaster = useToastHandler();
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();
  const updataInvoice = useUpdateInvoice();
  const [selectedInvoice, setSelectedInvoice] = useState<UpdateInvoiceStatusRequest | null>(null);

  const { data: unpaidInvoices, isLoading: loadingUnpaidInvoices, refetch: refetchUnpaidInvoices } = useGetAllUnpaidInvoices();
  const invoiceCurrent = unpaidInvoices?.find((invoice) => invoice.tableId === id);

  const { data: servedOrders, isLoading: loadingServedOrders, refetch: refetchServedOrders } = useGetOrdersByStatus(OrderStatus.Served);
  const { data: menus, isLoading: loadingMenus } = useGetMenus();

  const orderData = servedOrders?.find((order) => order.tableId === id);
  const { data: table, isLoading: loadingTable } = useGetTableById(id);

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const { mutateAsync: updateLeftoverFood } = useUpdateLeftoverFood();
  const [leftoverFoodWeight, setLeftoverFoodWeight] = useState("");
  const [isConfirmedLeftover, setIsConfirmedLeftover] = useState(false);

  useEffect(() => {
    if (!loadingServedOrders) {
      refetchServedOrders();
    }
  }, [loadingServedOrders, refetchServedOrders]);

  useEffect(() => {
    if (phoneNumber?.length === 0) setIsVisible(false);
    else setIsVisible(true);
    refetchUnpaidInvoices();
  }, [phoneNumber])

  if (loadingUnpaidInvoices || loadingServedOrders || loadingMenus || loadingTable) {
    return <LoadingAnimation />;
  }

  const orderItemsWithMenu: OrderItemWithMenu[] = (orderData?.orderItem || []).map((item) => {
    const menu = menus?.find((menu) => menu.id === item.menuID) || { id: item.menuID, name: "", description: "", categoryId: "", imageUrl: "", isAvailable: false }; // Default object if menu not found

    return { ...item, menu };
  });
  console.log(orderItemsWithMenu)
  const confirmHandler = async () => {
    const invoice: UpdateInvoiceStatusRequest = {
      invoice_id: invoiceCurrent?.id || ""
    }
      setSelectedInvoice(invoice);
      setOpenDialog(true); 
  };

  function formatDate(date: Date): string {
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

  const handleConfirmLeftoverFood = async () => {
    if (!leftoverFoodWeight) return;

    try {
      await updateLeftoverFood({
        invoice_id: invoiceCurrent?.id || "",
        total_food_weight: Number(leftoverFoodWeight),
      });

      setIsConfirmedLeftover(true);
      refetchUnpaidInvoices();
    } catch (error) {
      console.error("Error updating leftover food weight:", error);
    }
    };

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-row justify-between">
        <div className="font-bold text-xl items-center flex px-5 rounded-lg border-2 border-primary">
          <DateTimeDisplay />
        </div>
      </div>
      <div className="flex flex-row justify-between h-fit items-center">
        <div>
          <span className="font-bold">Invoice ID:</span> {invoiceCurrent?.id}
        </div>
        <div className="flex flex-row gap-5">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-row items-center">
              <MdTableBar className="mx-2 w-6 h-6" />:
            </div>
            <p>{table?.tableName}</p>
          </div>
          <div className="flex flex-row items-center">Time :{table?.entryAt ? formatDate(new Date(table.entryAt)) : "No date"}</div>
        </div>
      </div>
      <div className="collapse bg-primary w-full">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-bold grid grid-cols-2 text-center w-full">
          <div>Menu</div>
          <div>Quantity</div>
        </div>
        <div className=" bg-wherePrimary">
          {
            orderItemsWithMenu.map((oim, i) => {
              return (
                <div key={i} className="grid grid-cols-2 w-full border-b-2 py-5 text-center">
                  <div className="font-bold items-center">{oim.menu?.name}</div>
                  <div>{oim.quantity}</div>
                </div>
              );
            })
          }
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div>
        <div><span className="text-red-500 font-bold">อาหารเหลือ (กรัม): </span>
        <input
          type="text"
          className="border rounded px-2 py-1"
          value={leftoverFoodWeight}
          onChange={(e) => setLeftoverFoodWeight(e.target.value)}
          disabled={isConfirmedLeftover}
        />
        {!isConfirmedLeftover && (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={handleConfirmLeftoverFood}
          >
            ยืนยัน
          </button>
        )}
      </div>

          <div><span className="font-bold">จำนวนคน:</span> {invoiceCurrent?.peopleAmount}</div>
          <div><span className="font-bold">ราคาที่ต้องชำระ: </span>{invoiceCurrent?.totalPrice} baht</div>


          <div className="flex justify-row">
            {isVisible && <p className="text-whereBlack">ส่วนลดสะสมแต้มจาก <span> {phoneNumber} </span> </p>}
            {/* {isVisible && <button className="text-red underline font-bold text-error" onClick={() => {
              setPhoneNumber("");
            }} > ลบ</button>} */}
          </div>
        </div>
        <div><span className="font-bold">total order:</span> {orderData?.orderItem.length}</div>
      </div>
      <div className="flex flex-row gap-4 justify-center">
        <div className="w-full flex flex-row gap-4 justify-center">
          <div className="btn bg-grey border-none text-white w-auto"
            onClick={() => router.push("/manager/all-payment"
            )}>
            กลับสู่หน้าชำระเงิน
          </div>


          <div className="btn btn-success text-white w-auto" onClick={() => {
            confirmHandler();
            setOpenDialog(true);
          }}>
            ยืนยันการชำระเงิน
          </div>

          <div className="btn btn-success bg-primary border-none text-white w-auto" onClick={() => {
            setOpenUsePointDialog(true);
          }}>
            ใช้แต้มสะสม
          </div>

        </div>

        <div className="btn btn-primary w-fit" onClick={() => console.log("printing")}>
          <PiPrinterFill className="w-full h-full text-whereWhite" />
        </div>
      </div>

      <ConfirmDialog
        title="ยืนยันการชำระเงิน?"
        description="แน่ใจหรือไม่ว่าต้องการยืนยันการชำระเงิน"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        callback={async () => {
          if(isVisible){
            if(selectedInvoice){
            await updataInvoice.mutateAsync(selectedInvoice);
            toaster("ลูกค้าชำระเงินสำเร็จ", "ข้อมูลออเดอร์จะถูกจัดเก็บในประวัติออเดอร์");
            router.push("/manager/all-payment");
          }
          }else{
           setOpenAddPointDialog(true);

          }
        }}
      />

      <AddPointDialog
        openDialog={openAddpointDialog}
        setOpenDialog={setOpenAddPointDialog}
        callback={async () => {
          if (selectedInvoice) {
            await updataInvoice.mutateAsync(selectedInvoice);
          }
          toaster("ลูกค้าชำระเงินสำเร็จ", "ข้อมูลออเดอร์จะถูกจัดเก็บในประวัติออเดอร์");
          router.push("/manager/all-payment");
        }}
      />

      <UsePointDialog
        openDialog={openUsePointDialog}
        setOpenDialog={setOpenUsePointDialog}
        callback={async () => {
          setIsVisible(!isVisible);

        }}
        invoice_id={invoiceCurrent?.id || ""}
        setPhone={(phone) => setPhoneNumber(phone)}
      />

    </div>
  );
}