'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";
import { useAddCategory } from '@/api/manager/useCategory';

type AddCategoryProps = {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
};

const AddCategoryDialog = ({ openDialog, setOpenDialog }: AddCategoryProps) => {
    const [inputCategory, setInputCategory] = useState("");

    const addCategory = useAddCategory();

    const handleSave = () => {

        if (inputCategory === "") {
            return;
        }

        addCategory.mutate({ categoryName: inputCategory });
        setOpenDialog(false);
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <div className="py-10 align-middle gap-3 flex flex-col w-full">
                    <label className="text-2xl font-bold">เพิ่มประเภท </label>
                    <input
                        className="rounded border-2 h-12 p-3 w-full"
                        value={inputCategory}
                        onChange={(e) => setInputCategory((e.target.value))}
                    />
                </div>
                <div className="flex">
                    <DialogClose asChild>
                        <Button className="font-bold ml-auto btn text-xl text-white bg-error rounded-xl" >
                            ยกเลิก
                        </Button>
                    </DialogClose>
                    <button className="text-xl bg-success btn rounded-xl text-white ml-3" onClick={handleSave}>บันทึก</button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryDialog;
