import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { AddCategoryRequest, CategoryDetailResponse } from "@/interfaces/category";
import { getSession } from "next-auth/react";
import { BaseMenuResponse } from "@/interfaces/menu";

const getBestMenuSellers = async () => {
    const session = await getSession();
    const { data } = await axiosInstance.get("/general/menus/best-selling")
    return data;
}

const useGetBestMenuSellers = () => {
    return useQuery<BaseMenuResponse[]>({
        queryKey: ["best-menus"],
        queryFn: getBestMenuSellers,
        staleTime: 5 * 60 * 1000,
    });
}

export { useGetBestMenuSellers };