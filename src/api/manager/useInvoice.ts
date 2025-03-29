import { BaseInvoiceResponse, CancelInvoice, UpdateInvoiceStatusRequest } from "@/interfaces/invoice";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const getAllPaidInvoices = async () => {
    const session = await getSession();
    const { data } = await axiosInstance.get("/manage/invoices/paid", {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const getAllUnpaidInvoices = async () => {
    const session = await getSession();
    const { data } = await axiosInstance.get("/manage/invoices/unpaid", {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const updateInvoice = async (updateInvoice: UpdateInvoiceStatusRequest) => {
    const session = await getSession();
    const { data } = await axiosInstance.put(`/manage/invoices/set-paid`, updateInvoice, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const useUpdateInvoice = () => {
    return useMutation({
        mutationFn: updateInvoice,
    });
}

const useGetAllPaidInvoices = () => {
    return useQuery<BaseInvoiceResponse[]>({
        queryKey: ["paidInvoices"],
        queryFn: getAllPaidInvoices,
        staleTime: 5 * 60 * 1000,
    });
}

const useGetAllUnpaidInvoices = () => {
    return useQuery<BaseInvoiceResponse[]>({
        queryKey: ["unpaidInvoices"],
        queryFn: getAllUnpaidInvoices,
        staleTime: 5 * 60 * 1000,
    });
}

const cancelInvoice = async (invoice_id:string) => {
    const session = await getSession();
    const { data } = await axiosInstance.delete(`/manage/invoices/${invoice_id}`, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const useCancelInvoice = () => {
    return useMutation({
        mutationFn: cancelInvoice,
    });
}

const updateLeftoverFood = async ({ invoice_id, total_food_weight }: { invoice_id: string; total_food_weight: number }) => {
    const session = await getSession();
    const { data } : { data: any } = await axiosInstance.put("/manage/invoices/charge-food-overweight", {
        invoice_id,
        total_food_weight
    }, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data
};

const useUpdateLeftoverFood = () => {
    return useMutation({
        mutationFn: updateLeftoverFood,
    });
}


export { useUpdateInvoice, useGetAllPaidInvoices, useGetAllUnpaidInvoices ,useCancelInvoice, useUpdateLeftoverFood}
