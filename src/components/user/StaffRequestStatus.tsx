'use client';

import { useEffect } from "react";
import { useGetStaffRequestStatus } from "@/api/user/useStaffRequest";
import useToastHandler from "@/lib/toastHanlder";

type Props = {
  tableId: string;
};

export default function StaffRequestStatus({ tableId }: Props) {
  const { data: staffStatus } = useGetStaffRequestStatus(tableId);
  const toaster = useToastHandler();

  useEffect(() => {
    if (staffStatus?.status === "accepted") {
      toaster("พนักงานกำลังไปหาคุณ", "พนักงานกำลังไปหาคุณ");
    } 
    else if (staffStatus?.status === "rejected") {
      toaster("พนักงานปฏิเสธการเรียก", "พนักงานปฏิเสธการเรียกพนักงาน");
    }
  }, [staffStatus]);

  if (!staffStatus) return null; 

  return (
    <div className={`p-3 rounded-lg text-white text-center ${staffStatus.status === "accepted" ? "bg-orange-500" : "bg-red-500"}`}>
      {staffStatus.status === "rejected" ? "พนักงานกำลังไปหาคุณ" : "พนักงานปฏิเสธการเรียก"}
    </div>
  );
}
