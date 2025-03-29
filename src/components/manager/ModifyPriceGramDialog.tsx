import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
} from "@/components/ui/dialog"
import { useEditPricePerGram } from '@/api/manager/useSettingGram';

type ModifyPriceGramDialogProps = {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    price: number;
    onSave: (newPrice: number) => void;
    refetchPricePerGram: () => void;
};


const ModifyPriceGramDialog = ({ openDialog, setOpenDialog, price, onSave, refetchPricePerGram }: ModifyPriceGramDialogProps) => {
    const editPricePerGram = useEditPricePerGram();
    const [inputPrice, setInputPrice] = useState(price);

    const handleSave = async () => {

        await editPricePerGram.mutateAsync({ price_fee_food_overweight: inputPrice }, {
            onSuccess: () => {
                refetchPricePerGram();
                alert("แก้ไขราคาสำเร็จ");
            },
            onError: (error) => {
                alert("แก้ไขราคาไม่สำเร็จ");
            },
        });

        onSave(inputPrice);
        setOpenDialog(false);
    };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
                <div className="py-10 align-middle gap-6 flex items-center">
                    <label className="text-2xl font-bold">ราคา: </label>
                    <input
                        type="number"
                        className="rounded border-2 h-12 w-80 p-3"
                        value={inputPrice}
                        onChange={(e) => setInputPrice(Number(e.target.value))}
                    />
                </div>
                <div className="flex">
                    <DialogClose asChild>
                        <Button className="font-bold ml-auto btn text-xl text-white bg-error rounded-xl" >
                            ยกเลิก
                        </Button>
                    </DialogClose>
                    <button className="text-xl bg-primary btn rounded-xl text-white ml-3" onClick={handleSave}>บันทึก</button>
                </div>
            </DialogContent>
        </Dialog>
  )
}

export default ModifyPriceGramDialog