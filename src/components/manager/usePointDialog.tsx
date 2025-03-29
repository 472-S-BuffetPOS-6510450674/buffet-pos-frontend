import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState, ReactNode, Dispatch, SetStateAction } from "react";
import AddMemberDialog from "./addMemberDialog";
import { useGetCustomer, useRedeem } from "@/api/loyalty/useLoyalty";

type ConfirmDialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  callback?: () => void;
  setPhone?: (phone: string) => void;
  invoice_id: string
};

export function UsePointDialog({ openDialog, setOpenDialog, callback, setPhone, invoice_id }: ConfirmDialogProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const {
    data: customers = [],
    isLoading: loadingCustomers,
    isError: errorCustomers,
  } = useGetCustomer();
  const redeem = useRedeem();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  // const [members, setMembers] = useState<Member[]>([
  //   { phone: "064-293-xxxx", points: 9 },
  //   { phone: "222-111-xxxx", points: 1 },
  //   { phone: "113-333-xxxx", points: 1 },
  //   { phone: "442-454-xxxx", points: 1 },
  //   { phone: "142-252-xxxx", points: 1 },
  //   { phone: "543-233-xxxx", points: 9 },
  // ]);



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
    if (!selectedMember) {
      setError("กรุณาเลือกสมาชิก");
      return;
    }
    if (!pin) {
      setError("กรุณากรอก PIN");
      return;
    }

    try {
      await redeem.mutateAsync({
        invoice_id: invoice_id,
        phone: selectedMember,
        pin: pin
      }, {
        onSuccess: () => {
          setPhone?.(selectedMember); // แค่เอาไปโชวหน้าหลัก
          setOpenDialog(false);
        },
        onError: () => {
          setError("PIN ไม่ถูกต้อง");
        },
      })

    } catch (err) { }
    setIsLoadingButton(false);
  };
  
  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      <AlertDialogContent className="max-w-lg w-full p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <AlertDialogTitle className="font-bold text-lg">เลือกสมาชิกที่ต้องการใช้แต้มสะสม</AlertDialogTitle>
          <button onClick={() => {
            setOpenDialog(false);
            setPin("");
            setSelectedMember(null);
          }
          }>
            <p className="w-5 h-5 font-bold">X</p>
          </button>
        </div>

        <div className="flex justify-between my-3">
          <input placeholder="ค้นหาเบอร์โทรศัพท์" className="border-none rounded-xl p-3 w-full text-whereBlack bg-zinc-100" value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <Button className="ml-3 bg-success text-white font-bold" onClick={() => setOpen(true)}>+ เพิ่มสมาชิก</Button>
          <AddMemberDialog open={open} onClose={() => setOpen(false)} />
        </div>

        <div className="overflow-y-auto max-h-60 border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="px-9 py-2">เบอร์โทรศัพท์</th>
                <th className="px-4 py-2 ">แต้มสะสม</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.phone}
                  className={`border-t cursor-pointer ${selectedMember === member.phone ? "bg-orange-100" : ""}  ${member.point < 10 ? 'bg-zinc-100 cursor-not-allowed text-grey' : ''}`}
                  onClick={() => member.point < 10 ? null : handleMemberSelect(member.phone)}
                >
                  <td className="px-4 py-2 flex items-center gap-2" >
                    <input type="radio" className={`accent-primary w-4 h-4 border-2 rounded-full`}
                      name="member" checked={selectedMember === member.phone} readOnly={member.point < 10} />
                    {member.phone}
                  </td>
                  <td className={`px-7 py-2 text-black font-normal ${member.point < 10 ? 'bg-zinc-100 cursor-not-allowed text-grey' : ''} `}>{member.point} / 10</td>
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

        <Button className="w-full bg-primary text-white mt-4" onClick={handleConfirm} disabled={isLoadingButton}>
          {isLoadingButton ? "loading..." : "ยืนยัน"}
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function setMembers(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}

