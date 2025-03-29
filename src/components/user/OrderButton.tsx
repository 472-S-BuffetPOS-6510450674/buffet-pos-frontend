'use client';

import { useCart } from "@/provider/CartProvider";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../manager/confirmDialog";
import { useState } from "react";
import StaffRequestStatus from "./StaffRequestStatus";
import { useCreateStaffRequest } from "@/api/user/useStaffRequest";
import useToastHandler from "@/lib/toastHanlder";

export default function OrderButton({ table_id }: { table_id: string }) {
    const router = useRouter();
    const { cart } = useCart();

    const [openDialog, setOpenDialog] = useState(false);

    const createStaffRequest = useCreateStaffRequest();
    const toaster = useToastHandler();

    return (
        <div className="fixed bottom-0 right-0 p-5">
            <div className="flex flex-row gap-3">
                <div className="relative bg-primary rounded-full p-3" onClick={()=>router.push('/user/cart')}>
                   {cart.length > 0 && <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg text-sm text-whereBlack px-1">
                        <p className="text-sm">{cart.reduce((acc, item) => acc + item.quantity, 0) > 99 ? '99+' : cart.reduce((acc, item) => acc + item.quantity, 0) }</p>
                    </div>}
                    <Icon icon="ic:baseline-shopping-cart" fontSize={30} color='#fff' />
                </div>
                
                <div className="bg-primary rounded-full p-3" onClick={()=>router.push('/user/history')}>
                    <Icon icon="ic:baseline-history" fontSize={30} color='#fff' />
                </div>

                <div className="bg-primary rounded-full p-3" onClick={() => {
                    setOpenDialog(true);
                }}>
                    <Icon icon="ic:baseline-person" fontSize={30} color='#fff' />
                </div>

                <ConfirmDialog
                title="ยืนยันการเรียกพนักงาน?"
                description="แน่ใจหรือไม่ว่าต้องการเรียกพนักงาน"
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                callback={async () => {
                    await createStaffRequest.mutateAsync(table_id, {
                        onSuccess: () => {
                            toaster("success", "เรียกพนักงานสำเร็จ");
                        },
                        onError: () => {
                            toaster("error", "เรียกพนักงานไม่สำเร็จ");
                        },
                    });
                }}
                />
            </div>
        </div>
    );
}