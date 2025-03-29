'use client';

import { useGetBestMenuSellers } from "@/api/general/useBestSeller";
import { useGetMenus } from "@/api/manager/useMenu";
import AddCategoryDialog from "@/components/manager/addCategoryDialog";
import { AddMenuDialog } from "@/components/manager/addMenuDialog";
import DeleteCategoryDialog from "@/components/manager/DeleteCategoryDialog";
import LoadingAnimation from "@/components/manager/loadingAnimation";
import MenuCard from "@/components/manager/menuCard";
import MenuPopularCard from "@/components/manager/menuPopularCard";
import { BaseMenuResponse } from "@/interfaces/menu";
import { useState } from "react";

export default function MenuPage() {
    const [openDialog, setOpenDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [openDeleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { data: menus = [], isLoading: loadingMenus, refetch: refetchMenus } = useGetMenus();
    const { data: bestMenu = [], isLoading: loadingBestMenus, refetch: refetchBestMenus} = useGetBestMenuSellers();

    if (loadingMenus) {
        return <LoadingAnimation />;
    }

    if (loadingBestMenus) {
        return <LoadingAnimation />;
    }

    const deleteCategoryHandler = async () => {
        setDeleteCategoryDialog(true);
    };

    const addCategoryHandler = () => {
        setOpenCategoryDialog(true);
    };

    const addMenuHandler = () => {
        setOpenDialog(true);
    };

    // Filter menus based on the search term
    const filteredMenus = menus.filter((menu: BaseMenuResponse) =>
        menu.name && menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBestMenus = bestMenu.filter((menu: BaseMenuResponse) =>
        menu.name && menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full flex flex-col gap-10">
            <div className="flex flex-row justify-between">
                <label className="input input-bordered flex items-center gap-2 rounded-xl">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>
                <div>
                    <div className="btn btn-error text-white font-bold text-lg mr-3" onClick={deleteCategoryHandler}>
                        - Delete Category
                    </div>
                    <div className="btn btn-secondary text-white font-bold text-lg mr-3" onClick={addCategoryHandler}>
                        + Add Category
                    </div>
                    <div className="btn btn-success text-white font-bold text-lg" onClick={addMenuHandler}>
                        + Add Menu
                    </div>
                </div>
            </div>

            <div className="text-3xl font-bold">
                เมนูขายดี
            </div>

            <div className="grid grid-cols-3 gap-10">

                {Array.isArray(filteredBestMenus) && filteredBestMenus.length > 0 ? (
                    filteredBestMenus.slice(0, 3).map((menu: BaseMenuResponse, index: number) => (
                        <MenuPopularCard key={menu.id} menu={menu} refetchMenus={refetchMenus} rank={index+1} />
                    ))
                ) : (
                    <p>No menus available</p>
                )}
            </div>

            <hr />

            <div className="grid grid-cols-3 gap-10">
                {Array.isArray(filteredMenus) && filteredMenus.length > 0 ? (
                    filteredMenus.map((menu: BaseMenuResponse) => (
                        <MenuCard key={menu.id} menu={menu} refetchMenus={refetchMenus} />
                    ))
                ) : (
                    <p>No menus available</p>
                )}
            </div>
            <AddMenuDialog openDialog={openDialog} setOpenDialog={setOpenDialog} refetchMenus={refetchMenus} />
            <AddCategoryDialog openDialog={openCategoryDialog} setOpenDialog={setOpenCategoryDialog} />
            <DeleteCategoryDialog openDialog={openDeleteCategoryDialog} setOpenDialog={setDeleteCategoryDialog} />
        </div>
    );
}
