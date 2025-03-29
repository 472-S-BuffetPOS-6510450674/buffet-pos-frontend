import { ReactNode } from "react";
import StaffRequestStatus from "@/components/user/StaffRequestStatus";
import { useGetTable } from "@/api/user/useTable";

export default function ScreenMobile({ children }: { children: ReactNode }) {
    const { data: table } = useGetTable("some_table_id");
    const tableId = table?.id;
    return (
        <div className={`bg-gray-100 h-full max-w-lg mx-auto overscroll-none scrollbar-hide select-none`}>
            {tableId && <StaffRequestStatus tableId={tableId} />}
            {children}
        </div>
    );
}

