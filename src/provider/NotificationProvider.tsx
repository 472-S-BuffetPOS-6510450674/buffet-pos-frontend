'use client';

import { useGetAllNotification, useUpdateStaffRequestStatus } from '@/api/manager/useStaffHandle';
import { useGetTables } from '@/api/manager/useTable';
import { TableDetailResponse } from '@/interfaces/table';
import axiosInstance from '@/lib/axiosInstance';
import { getSession } from 'next-auth/react';
import { createContext, useContext, ReactNode, useState, use, useEffect } from 'react';


const NotificationContext = createContext<any>(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export default function NotificationProvider({ children }: { children: ReactNode }) {
    const { data: notifications, refetch: refetchNotifications } = useGetAllNotification();
    const updateStaffRequestStatus = useUpdateStaffRequestStatus();
    const [tableList, setTableList] = useState<TableDetailResponse[]>([]);

    const updateNotificationState = (request_id: string, status: "accepted" | "rejected") => {
        console.log(request_id, status);
        updateStaffRequestStatus.mutate({
            staff_notification_id: request_id,
            status: status,
        }, {
            onSuccess: () => {
                refetchNotifications();
            }
        });
    }

    const fetchTables = async () => {
        const session = await getSession();
        const { data } = await axiosInstance.get("/manage/tables", {
            headers: {
                Authorization: `Bearer ${session?.token}`,
            },
        });
        setTableList(data);
    }

    useEffect(() => {
        fetchTables();
    }, []);

    return <NotificationContext.Provider value={{ notifications, updateNotificationState }}>
        <div className="absolute w-1/3 right-0 top-0 p-4shadow-lg rounded-2xl border-none z-[999]">
            <div className="space-y-2">
                {notifications?.filter((noti) => noti.status === "pending").map((notification, _) => {
                    const tableName = tableList.find((table) => table.accessCode === notification.table_id)?.tableName;
                    return (
                        <div key={_} className="p-6 bg-primary rounded-xl text-white flex flex-row justify-between items-center">
                            <div className='flex flex-col gap-2'>
                                <p className="font-bold ">
                                    โต๊ะ {tableName} : กำลังเรียกพนักงาน
                                    
                                </p>
                                <p className="text-sm ">
                                    ลูกค้าโต๊ะ {tableName} ได้ทำการเรียกคุณ
                                </p>
                            </div>
                            <div className='flex flex-row gap-4 rounded-md items-center text-sm p-2 justify-center font-semibold'>
                                <button className="bg-success text-white rounded-md py-2 px-4 " onClick={() => updateNotificationState(notification.id, "accepted")}>ยอมรับ</button>
                                <button className="bg-error text-white rounded-md px-4 py-2" onClick={() => updateNotificationState(notification.id, "rejected")}>ปฏิเสธ</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
        {children}
    </NotificationContext.Provider>;
}