import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddMemberDialog from "./addMemberDialog";
import { useAddPoint, useGetCustomer } from "@/api/loyalty/useLoyalty";

type Member = {
  phone: string;
  points: number;
};

type ConfirmDialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  callback?: () => void;
};

export function AddPointDialog({ openDialog, setOpenDialog, callback }: ConfirmDialogProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const {
    data: customers = [],
    isLoading: loadingCustomers,
    isError: errorCustomers,
    refetch: refetchCustomers,
  } = useGetCustomer();
  const addPoint = useAddPoint();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  // const [members, setMembers] = useState<Member[]>([
  //   { phone: "064-293-xxxx", points: 9 },
  //   { phone: "222-111-xxxx", points: 1 },
  //   { phone: "113-333-xxxx", points: 1 },
  //   { phone: "442-454-xxxx", points: 1 },
  //   { phone: "142-252-xxxx", points: 1 },
  //   { phone: "543-233-xxxx", points: 9 },
  // ]);

  const [open, setOpen] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = customers.filter((member) => {
    const cleanPhone = member.phone.replace(/[^0-9]/g, ''); 
    const cleanSearchTerm = searchTerm.replace(/[^0-9]/g, ''); 
    return cleanPhone.includes(cleanSearchTerm);
  });
  
  const handleMemberSelect = (phone: string) => {
    setSelectedMember(phone);
  };
  
  const handleConfirm = async () => {
    setIsLoadingButton(true);
    if (!pin && selectedMember) {
      setError("กรุณากรอก PIN");
      return;
    }
    if (!selectedMember && pin) {
      setError("กรุณาเลือกสมาชิก");
      return;
    }
    if(!selectedMember && !pin){
      callback?.();
    }
    try {
      await addPoint.mutate(
        {
          phone: selectedMember!,
          pin: pin,
          point: 1, // เพิ่มแต้ม 1 แต้ม
        },{
          onSuccess: () => {
            console.log("Refetching customer data...");
            setSelectedMember(null);
            setPin("");
            setError("");
            callback?.();
            refetchCustomers();  // รีเฟรชข้อมูลลูกค้า
            setOpenDialog(false);
          },
          onError: (error) => {
            setError("PIN ไfม่ถูกต้อง");
          },});
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเพิ่มแต้ม");}
  };

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent className="max-w-lg w-full p-6 rounded-lg shadow-lg">
        {/* Close Button */}
        <div className="flex justify-between items-center">
          <AlertDialogTitle className="font-bold text-lg">เลือกสมาชิกที่ต้องการเพิ่มแต้มสะสม</AlertDialogTitle>
          <button onClick={() => {
            setOpenDialog(false)
            setSelectedMember(null);
          }}>
            <p className="w-5 h-5 font-bold">X</p>
          </button>
        </div>

        <div className="flex justify-between my-3">
          <input placeholder="ค้นหาเบอร์โทรศัพท์" className="border-none rounded-xl p-3 w-full text-whereBlack bg-zinc-100" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <Button className="ml-3 bg-success text-white font-bold" onClick={() => setOpen(true)}>+ เพิ่มสมาชิก</Button>
          <AddMemberDialog open={open} onClose={() => setOpen(false)} />
        </div>

        {/* Member List */}
        <div className="overflow-y-auto max-h-60 border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="px-9 py-2">เบอร์โทรศัพท์</th>
                <th className="px-4 py-2 ">แต้มสะสม</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers?.map((member) => (
                <tr
                  key={member.phone}
                  className={`border-t cursor-pointer ${selectedMember === member.phone ? "bg-orange-100" : ""}`}
                  onClick={() => handleMemberSelect(member.phone)}
                >
                  <td className="px-4 py-2 flex items-center gap-2">
                    <input type="radio" className=" accent-primary w-4 h-4 border-2 rounded-full" name="member" checked={selectedMember === member.phone} readOnly />
                    {member.phone}
                  </td>
                  <td className={`px-7 py-2 text-black font-normal`}> {member.point} / 10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <label className="font-semibold">PIN : </label>
          <input
            type="password"
            placeholder="กรอก PIN"
            className="border px-3 py-2 rounded-md w-full"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
          />
          {error && <p className="pl-2 pt-2 text-error text-sm mt-1">{error}</p>}
        </div>

        <Button className="w-full bg-orange-500 text-white mt-4" onClick={handleConfirm} >
          ยืนยัน
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}