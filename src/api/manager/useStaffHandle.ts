'use client';

import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

interface StaffRequestStatusResponse {
    status: "pending" | "accepted" | "rejected";
    id: string;
    table_id: string;
    createdAt: string;
    updatedAt: string;
}

interface UpdateStaffRequestRequest {
    staff_notification_id: string;
    status: "accepted" | "rejected";
}

const getAllNotification = async () => {
    const session = await getSession();
    const { data } = await axiosInstance.get(`/manage/staff-notifications`, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });

    return data as StaffRequestStatusResponse[];
}

const updateStaffRequestStatus = async (newStatus: UpdateStaffRequestRequest) => {
    const session = await getSession();
    const { data } = await axiosInstance.put("/manage/staff-notifications", newStatus, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const useGetAllNotification = () => {
    return useQuery<StaffRequestStatusResponse[]>({
        queryKey: ["staff-notification"],
        queryFn: () => getAllNotification(),
        staleTime: 0,
        refetchInterval: 3000,
    });
}

const useUpdateStaffRequestStatus = () => {
    return useMutation({
        mutationFn: updateStaffRequestStatus,
    });
}

export { useGetAllNotification, useUpdateStaffRequestStatus };