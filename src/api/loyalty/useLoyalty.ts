import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { AddCategoryRequest, CategoryDetailResponse } from "@/interfaces/category";
import { getSession } from "next-auth/react";
import { AddCustomer, AddPoint, Redeem } from "@/interfaces/loyalty";
import { Session } from "inspector/promises";

const getCustomers = async () => {
    const session = await getSession();
    const { data } = await axiosInstance.get("/loyalty/customers", {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}


const addCustomer = async (newCustomer: AddCustomer) => {
    const session = await getSession();
    const { data } = await axiosInstance.post("/loyalty/register", newCustomer, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const redeem = async (reedemDetail: Redeem) => {
    const session = await getSession();
    const { data } = await axiosInstance.post("/loyalty/redeem", reedemDetail, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    })
    return data;
}

const addPoint = async (newPoint: AddPoint) => {
    const session = await getSession();
    const { data } = await axiosInstance.post("/loyalty/add-point", newPoint, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const getCategoryById = async (id: string) => {
    const session = await getSession();
    const { data } = await axiosInstance.get(`/manage/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const deleteCustomer = async (id: string) => {
    const session = await getSession();
    const { data } = await axiosInstance.delete(`/loyalty/customer/${id}`, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    })
    return data;
}

// -----------------------------------------------
const useAddCustomer = () => {
    return useMutation({
        mutationFn: addCustomer,
    })
}

const useGetCustomer = () => {
    return useQuery<{ id: string, phone: string, point: number }[]>({
        queryKey: ["Customers"],
        queryFn: getCustomers,
        staleTime: 5 * 60 * 1000,
    });
}

const useRedeem = () => {
    return useMutation({
        mutationFn: redeem,
    });
}

const useAddPoint = () => {
    return useMutation({
        mutationFn: addPoint,
    })
}

const useDeleteCustomer = () => {
    return useMutation({
        mutationFn: deleteCustomer,
    })
}

export { useAddCustomer, useGetCustomer, useRedeem, useAddPoint, useDeleteCustomer };