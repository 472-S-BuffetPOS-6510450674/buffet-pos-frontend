'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
} from "@/components/ui/dialog";
import { DefaultDropdown } from "./defaultDropdown";
import { useDeleteCategory, useGetCategories } from '@/api/manager/useCategory';

type DeleteCategoryProps = {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
};

const DeleteCategoryDialog = ({ openDialog, setOpenDialog }: DeleteCategoryProps) => {
    const { data: categories, refetch: refetchCategory } = useGetCategories();
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const deleteCategory = useDeleteCategory();

    const handleSave = async () => {
        const category = categories?.find((c) => c.name === selectedCategory);
        if (!category) {
            return;
        }

        await deleteCategory.mutateAsync(category.id);
        setOpenDialog(false);
        refetchCategory();
    };
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <p>ลบประเภท</p>
                <DefaultDropdown
                    list={categories && categories.map((c) => c.name)}
                    setSelected={setSelectedCategory}
                />
                <div className='flex justify-end w-full mt-4'>
                    <DialogClose asChild>
                        <Button
                            className="font-bold btn text-xl text-white bg-grey rounded-xl hover:bg-grey"
                        >
                            ยกเลิก
                        </Button>
                    </DialogClose>
                    <button
                        className="text-xl bg-error btn rounded-xl text-white ml-3"
                        onClick={handleSave}
                    >
                        ลบ
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteCategoryDialog;
