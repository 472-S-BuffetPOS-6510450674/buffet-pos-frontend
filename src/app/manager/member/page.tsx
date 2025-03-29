"use client";

import useToastHandler from "@/lib/toastHanlder";
import { useState } from "react";
import { ConfirmDialog } from "@/components/manager/confirmDialog";


import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import AddMemberDialog from "@/components/manager/addMemberDialog";
import { useDeleteCustomer, useGetCustomer } from "@/api/loyalty/useLoyalty";
//import { AddPointDialog } from "@/components/manager/addPointDialog";
//import { UsePointDialog } from "@/components/manager/usePointDialog";
//import toast, { Toaster } from "react-hot-toast";
// interface PreparingOrderWithTable extends OrderResponse {
//   table: BaseTableResponse;
// }

export default function MemberPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const deleteCustomer = useDeleteCustomer();

  //   const toaster = useToastHandler();
  //   const updateOrder = useUpdateOrder();
  //   const [openDialog, setOpenDialog] = useState(false);
  //   const { data: tables, isLoading: loadingTables, refetch: refetchTables } = useGetTables();
  //   const {data: preparingOrders =[], isLoading: loadingPreparingOrders,refetch: refetchPreparingOrders } = useGetOrdersByStatus(OrderStatus.Preparing);

  //   const [orderData, setOrderData] = useState<UpdateOrderRequest>();

  const {
    data: customers = [],
    isLoading: loadingCustomers,
    isError: errorCustomers,
    refetch: refetchCustomers,
  } = useGetCustomer();

  const filteredMembers = customers.filter((member) => {
    const cleanPhone = member.phone.replace(/[^0-9]/g, '');
    const cleanSearchTerm = searchTerm.replace(/[^0-9]/g, '');
    return cleanPhone.includes(cleanSearchTerm);
  });

  // const initialData = [
  //   { phone: "064-293-xxxx", points: "1 / 10" },
  //   { phone: "064-293-xxxx", points: "1 / 10" },
  //   { phone: "064-293-xxxx", points: "1 / 10" },
  //   { phone: "064-293-xxxx", points: "1 / 10" },


  // const initialData = [
  // ];

  // const [data, setData] = useState();

  const handleDelete = async (id: string) => {
    await deleteCustomer.mutateAsync(id);
    refetchCustomers();
  };

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");

  const toaster = useToastHandler();

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-row justify-between">
        <label className="input input-bordered flex items-center gap-2 rounded-xl border-none">
          <input placeholder="ค้นหาเบอร์โทรศัพท์" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-6 w-5 opacity-70 text-grey"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

        <Button variant="destructive" onClick={() => setOpen(true)} className="bg-success text-white font-bold" >
          + เพิ่มสมาชิก
        </Button>

        <AddMemberDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        callback={async () => {
            toaster("เพิ่มสมาชิกสำเร็จ", "คุณได้ทำการเพิ่มสมาชิกเข้าในระบบ");
          }
        }
        refetchCustomers={refetchCustomers} />
      </div>

      <table className="table-auto justify-center text-whereBlack bg-zinc-100">
        <TableHeader>
          <TableRow>
            <TableHead>เบอร์โทรศัพท์</TableHead>
            <TableHead>แต้มสะสม</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member, index) => (
            <TableRow key={index}>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.point}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => {
                  setSelectedMember(member.id);
                  setOpenDialog(true);
                }}>
                  ลบ
                </Button>
              </TableCell>
            </TableRow>

          ))}

        </TableBody>
      </table>
      <ConfirmDialog
        title="แน่ใจหรือไม่ว่าต้องการลบ?"
        description="แน่ใจหรือไม่ว่าต้องการเบอร์นี้"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        callback={async () => {
          handleDelete(selectedMember);
          toaster("ลบสมาชิกสำเร็จ", "คุณได้ทำการลบสมาชิกในระบบเรียบร้อย");
        }
        }
      />
    </div>
  );
}
