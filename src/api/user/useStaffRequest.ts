'use client';

import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

interface StaffRequestStatusResponse {
    status: "pending" | "accepted" | "rejected";
}

const getStaffRequestStatus = async (tableId: string) => {
    const { data } = await axiosInstance.get(`/customer/staff-notifications/${tableId}`, {
        headers: {
            AccessCode: tableId,
        },
    });
    return data as StaffRequestStatusResponse;
}

const createStaffRequest = async (tableId: string) => {
    const { data } = await axiosInstance.post("/customer/staff-notifications", { table_id: tableId }, {
        headers: {
            AccessCode: tableId,
        },
    });
    return data;
}

const useGetStaffRequestStatus = (tableId: string) => {
    return useQuery<StaffRequestStatusResponse>({
        queryKey: ["staff-request-status", tableId],
        queryFn: () => getStaffRequestStatus(tableId),
        staleTime: 0,
        refetchInterval: 3000,
    });
}

const useCreateStaffRequest = () => {
    return useMutation({
        mutationFn: createStaffRequest,
    });
}

export { useGetStaffRequestStatus, useCreateStaffRequest };