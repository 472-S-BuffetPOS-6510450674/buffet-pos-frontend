// Navbar.js
'use client';
import React from 'react';
import { ImSpoonKnife } from "react-icons/im";
import { MdTableBar } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { BsFillCreditCardFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { RxExit } from "react-icons/rx";
import { MdPerson} from "react-icons/md"
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const menuItems = [
    { icon: <ImSpoonKnife />, label: 'จัดการเมนู', route: '/manager/menu' },
    { icon: <MdTableBar />, label: 'จองโต๊ะ', route: '/manager/table-reservation' },
    { icon: <IoDocumentText />, label: 'ออเดอร์ปัจจุบัน', route: '/manager/order' },
    { icon: <BsFillCreditCardFill />, label: 'ชำระเงิน', route: '/manager/all-payment' },
    { icon: <FaHistory />, label: 'ประวัติออเดอร์', route: '/manager/history' },
    { icon: <LuSettings />, label: 'ตั้งค่าร้าน', route: '/manager/setting' },
    { icon: <MdPerson/>, label: 'สมาชิก', route: '/manager/member'},
    { icon: <RxExit />, label: 'ออกจากระบบ', action: signOut }
];


const Navbar = () => {
    const router = useRouter();

    return (
        <div className='w-3/12 bg-[#FEF8F2] text-black px-8 py-4 sticky top-0 z-10 h-screen'>
            <p className='text-3xl'>Buffet</p>
            <p className='text-6xl'>P<span className='text-primary'>O</span>S</p>

            <div className='mt-16'>
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className='items-center mt-14 h-9 text-2xl flex hover:text-primary cursor-pointer'
                        onClick={() => item.action ? item.action() : router.push(item.route)}
                    >
                        {item.icon}
                        <span className='ml-2'>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Navbar;