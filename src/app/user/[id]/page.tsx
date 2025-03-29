'use client';

import ScreenMobile from "@/components/ScreenMobile";
import HeaderTabs from "@/components/user/HeaderTabs";
import OrderButton from "@/components/user/OrderButton";
import { useEffect, useState } from "react";
import MenuList from "@/components/user/MenuList";
import { useGetMenus } from "@/api/user/useMenu";
import LoadingAnimation from "@/components/manager/loadingAnimation";
import { useCart } from "@/provider/CartProvider";
import { useGetCategories } from "@/api/user/useCategory";
import { BaseCategoryResponse } from "@/interfaces/category";
import { useGetTable } from "@/api/user/useTable";
import { BaseTableResponse } from "@/interfaces/table";
import { entryTime, remainingTime } from "@/lib/formatDate";
import { useGetBestMenuSellers } from "@/api/general/useBestSeller";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetStaffRequestStatus } from "@/api/user/useStaffRequest";
import useToastHandler from "@/lib/toastHanlder";

type Props = {
  params: { id: string }
}

export default function Home({ params }: Props) {
  const [search, setSearch] = useState<string>('');
  const { setAccessCode, cart, addItem } = useCart();
  const { data: menus, isLoading: isMenuLoading } = useGetMenus(params.id);
  const { data: bestMenus, isLoading: isBestMenuLoading } = useGetBestMenuSellers();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories(params.id) as { data: BaseCategoryResponse[], isLoading: boolean };
  const { data: table, isLoading: isLoadingTable } = useGetTable(params.id) as { data: BaseTableResponse, isLoading: boolean };
  const { data: staffStatus } = useGetStaffRequestStatus(params.id ?? "");
  const toaster = useToastHandler();
  const [callDuring, setCallDuring] = useState(false);

  useEffect(() => {
    setAccessCode(params.id);
    console.log(menus)
  }, [menus]);

  useEffect(() => {
    if (!callDuring) return;
    console.log(staffStatus);
    if (staffStatus?.status === "accepted") {
      toaster("พนักงานกำลังไปหาคุณ", "พนักงานกำลังไปหาคุณ");
    } 
    else if (staffStatus?.status === "rejected") {
      toaster("พนักงานปฏิเสธการเรียก", "พนักงานปฏิเสธการเรียกพนักงาน");
    }
    setCallDuring(false);
  }, [callDuring]);

  useEffect(() => {
    console.log(callDuring, staffStatus?.status);
    if (callDuring) return;
    if (staffStatus?.status === "accepted" || staffStatus?.status === "rejected") {
      setCallDuring(true)
    } 
  }, [staffStatus]);

  if (isMenuLoading || isLoadingCategories || isLoadingTable) return <LoadingAnimation />;
  if (!menus) return <p>ไม่พบเมนู</p>;

  const filteredMenuList = menus.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const menusByCategory = filteredMenuList.reduce((acc, item) => {
    const category = categories.find(cat => cat.id === item.categoryId);
    const categoryName = category ? category.name : "Unknown";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as { [key: string]: any[] });

  return (
    <ScreenMobile>
      <HeaderTabs categories={Object.keys(menusByCategory)} search={search} setSearch={setSearch} />
      <div className="flex flex-col gap-2 px-3 pt-16 pb-24">
        <div className="flex flex-row justify-between w-full">
          <p className=" w-1/3 font-bold text-2xl pl-1"> โต๊ะที่ : {table.tableName} </p>
          <p className=" w-2/3 font-bold text-2xl text-end"> เวลาในการทาน : {remainingTime(table.entryAt.toString())} นาที </p>
        </div>
        <p className="text-primary text-xl text-right pr-1"> {entryTime(table.entryAt.toString())} น. </p>
        <div className="m-2 space-y-10">

        {bestMenus && bestMenus.length > 0 && (
            <div id="ขายดี">
              <p className="text-2xl font-bold mb-2">ขายดี</p>
              <div className="grid grid-cols-1 gap-4">
                {bestMenus.slice(0, 5).map((menu, index) => {
                  const amount = cart.find((j) => j.menu_id === menu.id)?.quantity ?? 0;
                  return (
                    <div key={menu.id} className="flex border bg-white rounded-2xl">
                      <div className="flex w-2/5 p-3 h-[125px] relative">
                        <div className="relative w-full h-full overflow-hidden rounded-xl">
                          <Image className='' src={menu.imageUrl} alt={menu.name} layout="fill" />
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Popular #{index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col w-3/5 p-4">
                        <div className="flex flex-col h-full" >
                          <p className="text-xl mt-[-6px] m-[-18px]">{menu.name}</p>
                        </div>
                        <div className="flex justify-end h-full items-end pr-3 pb-1" >
                          <div className="flex flex-row items-center gap-3" >
                            <div className={`hover:cursor-pointer ${amount === 0 ? "opacity-50 cursor-not-allowed" : ""}`} 
                              onClick={() => amount > 0 && addItem({ menu_id: menu.id, quantity: -1 })}>
                            <Icon icon="simple-line-icons:minus" fontSize={40} color={amount !== 0 ? "#FF8B13" : "#bfbfbf"} />
                            </div>
                            <p className='text-2xl'>{amount}</p>
                            <div className='hover:cursor-pointer' onClick={() => addItem({ menu_id: menu.id, quantity: 1 })}>
                              <Icon icon="simple-line-icons:plus" fontSize={40} color='#FF8B13' />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(menusByCategory).map((key) => {
            return <MenuList key={key} title={key} menuList={menusByCategory[key]} />;
          })}
        </div>
      </div>
      <OrderButton table_id={params.id} />
    </ScreenMobile>
  );
}
