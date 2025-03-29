'use client';

import { EditPricePerGramRequest, SettingResponse } from "@/interfaces/setting";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

const getPricePerGram = async () => {
    const session = await getSession();
    const { data } = await axiosInstance.get("/manage/settings/price-fee-food-overweight", {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const editPricePerGram = async (newPrice: EditPricePerGramRequest) => {
    const session = await getSession();
    const { data } = await axiosInstance.put("/manage/settings/price-fee-food-overweight", newPrice, {
        headers: {
            Authorization: `Bearer ${session?.token}`,
        },
    });
    return data;
}

const useGetPricePerGram = () => {
    return useQuery<SettingResponse>({
        queryKey: ["price-fee-food-overweight"],
        queryFn: getPricePerGram,
        staleTime: 5 * 60 * 1000,
    });
}

const useEditPricePerGram = () => {
    return useMutation({
        mutationFn: editPricePerGram,
    });
}

export { useGetPricePerGram, useEditPricePerGram };