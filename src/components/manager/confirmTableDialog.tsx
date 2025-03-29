'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { BaseTableResponse } from "@/interfaces/table";
import { useEffect, useState } from "react";
import { useAssignTable } from "@/api/manager/useTable";
import {QRCodeSVG} from 'qrcode.react';

interface ConfirmTableDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  selectedTable: BaseTableResponse | null;
  tables: BaseTableResponse[] | undefined;
  refetchTables: () => void;
}

export function ConfirmTableDialog({
  openDialog,
  setOpenDialog,
  selectedTable,
  tables,
  refetchTables
}: ConfirmTableDialogProps) {
  const [peopleAmount, setPeopleAmount] = useState<number>(0);
  const [resData, setResData] = useState<BaseTableResponse>();
  const assignTable = useAssignTable();

  useEffect(() => {
    if (!selectedTable) {
      return;
    }
    setResData(selectedTable);
  }, [selectedTable]);

  if (!tables || !selectedTable) {
    return null;
  }

  const handleAssignTable = async () => {
    if (peopleAmount > 4) {
      alert("The number of people cannot exceed 4.");
      return;
    }

    const assignTableData = {
      id: selectedTable.id,
      peopleAmount: peopleAmount,
    };

    const res: BaseTableResponse = await assignTable.mutateAsync(assignTableData, {
      onSuccess: () => {
        refetchTables();
      },
    });

    if (!res.qrcode) {
      return alert("Failed to create QR code.");
    }
    setResData(res);
  };

  const reservationContent = () => {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-1/3">จำนวนคน:</div>
          <input
            type="number"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={peopleAmount}
            onChange={(e) => setPeopleAmount(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-1/3">โต๊ะที่:</div>
          <div className="border-2 p-3 rounded-xl text-center w-full">
            {selectedTable.tableName}
          </div>
        </div>
        <DialogFooter className="">
          <div
            className="btn btn-error text-whereWhite"
            onClick={() => setOpenDialog(false)}
          >
            ยกเลิก
          </div>
          <div
            className="btn btn-primary text-whereWhite"
            onClick={() => handleAssignTable()}
          >
            เปิดบิล
          </div>
        </DialogFooter>
      </div>
    )
  }

  const qrCodeContent = () => {

    if (!resData || !resData.qrcode) {
      return null;
    }

    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-8 items-center">
          <div className="font-bold text-lg">QR Code</div>
          <div className="flex flex-col w-full">
            <p><span className="font-bold">หมายเลขโต๊ะ:</span> {resData.tableName}</p>
            <p><span className="font-bold">เวลาเริ่มต้น:</span> {new Date(resData.entryAt).toLocaleString()}</p>
            <p><span className="font-bold">เวลาสิ้นสุด:</span> {new Date(new Date(resData.entryAt).getTime() + 2 * 60 * 60 * 1000).toLocaleString()}</p>
            <p><span className="font-bold">สถานะ:</span> {resData.isAvailable ? ("Free"): ("In Use")}</p>
          </div>
          <div className="w-full flex justify-center">
            <div className="border-2 p-3 rounded-xl items-center flex flex-col w-fit">
              <QRCodeSVG value={resData?.qrcode} size={200} />
            </div>
          </div>
          <div className="font-bold">
            กรุณาแสกน QR-Code เพื่อสั่งอาหาร
          </div>
        </div>
        <DialogFooter className="">
          <div
            className="btn btn-error text-whereWhite w-full"
            onClick={() => setOpenDialog(false)}
          >
            ปิด
          </div>
        </DialogFooter>
      </div>
    )
  }

  return (
    <Dialog open={openDialog}>
      <DialogContent className="w-full flex flex-col gap-6">
        <div className="flex flex-col h-full gap-6">
          <div className="flex flex-col w-auto gap-3">
            {
              (resData?.qrcode || selectedTable?.qrcode) ? qrCodeContent() : reservationContent()
            }
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
