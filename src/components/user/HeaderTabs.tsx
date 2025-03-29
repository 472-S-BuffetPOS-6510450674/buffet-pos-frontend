'use client';

import { useEffect, useRef, useState } from "react";
import { Icon } from '@iconify/react';
import { BaseCategoryResponse } from "@/interfaces/category";

const observeSections = (sections: string[], setSelected: (id: string) => void) => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setSelected(entry.target.id);
                }
            });
        },
        { threshold: 0.6 }
    );

    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            observer.observe(element);
        }
    });

    return () => {
        observer.disconnect();
    };
};

export default function HeaderTabs({ categories, search, setSearch }: { categories: string[], search: string, setSearch: React.Dispatch<React.SetStateAction<string>> }) {
    const [selected, setSelected] = useState<string>(categories[0]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isSearchShow, setIsSearchShow] = useState<boolean>(false);
    const ref = useRef(null) as any;

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // const sections = categories.map((item) => category);
        return observeSections(categories, setSelected);
    }, [setSelected]);



    const handleClickOutside = (event: any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsShow(false);
        }
    }

    const handleClickTab = (name: string) => {
        const element = document.getElementById(name);
        if (element) {
            const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            setTimeout(() => setSelected(name), 300);
        }
    };


    return (
        <>
            <div className="fixed flex flex-col gap-6 bg-white px-3 py-3 max-w-lg w-full z-[999]">
                <div className="flex overflow-x-scroll scrollbar-hide">
                    <div className="flex flex-row gap-3">
                        <div className="cursor-pointer">
                            <Icon icon="ic:baseline-search" fontSize={30} color='#ff8d13ef' onClick={() => setIsSearchShow(true)} />
                        </div>
                        <div className="cursor-pointer" onClick={() => setIsShow((e: boolean) => !e)}>
                            <Icon icon="ic:round-list" fontSize={30} color='#ff8d13ef' />
                        </div>
                    </div>

                    {isSearchShow && (
                        <div className="flex fixed z-[999] w-full bg-primary  left-0 top-0 flex-row items-center shadow-md rounded-br-lg rounded-bl-lg p-2">
                            <Icon icon="ic:round-close" fontSize={40} color='white' onClick={() => { setIsSearchShow(false); setSearch(''); }} />
                            <input
                                type="text"
                                placeholder="ค้นหาเมนูที่ต้องการ"
                                className="w-full rounded-lg p-[5px] pl-4 shadow-md m-2"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    )}


                    <div className="flex flex-row w-full items-center whitespace-nowrap gap-6 pl-5">

                        <div
                            className={`relative border-transparent pb-1 ${selected === "Best Sellers" ? 'border-b-0' : ''}`}
                            onClick={() => handleClickTab("ขายดี")}
                        >
                            <p className={selected === "ขายดี" ? "text-whereOrange" : "text-whereBlack"}>
                                ขายดี
                            </p>
                            {selected === "ขายดี" && (
                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-1 h-1 bg-whereOrange rounded-full"></span>
                                
                            )}
                        </div>
                        {categories!.map((category: string) => (
                            <div
                                className={`relative border-transparent pb-1 ${selected === category ? 'border-b-0' : null}`}
                                onClick={() => handleClickTab(category)}
                            >
                                <p className={selected === category ? "text-whereOrange" : "text-whereBlack"}>
                                    {category}
                                </p>
                                {selected === category && (
                                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-1 h-1 bg-whereOrange rounded-full"></span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div ref={ref} className={`z-[999] fixed bottom-0 flex flex-col gap-2 ${isShow ? 'block' : 'hidden'} shadow-xl bg-white rounded-xl max-w-lg w-full`}>
                <div className="flex flex-row justify-between m-3">
                    <p className="text-lg font-bold">เลือกหมวดหมู่</p>
                    <Icon icon="ic:round-close" fontSize={30} color='#ff8d13ef' onClick={() => setIsShow(false)} />
                </div>

                <div
                    className={`flex flex-row justify-start gap-2 py-4 px-7 border-b-[1px] ${selected === "Best Sellers" ? 'text-primary' : 'text-whereBlack'}`}
                    onClick={() => handleClickTab("ขายดี")}>
                    <p className="text-xl">ขายดี</p>
                </div>

                {categories!.map((category, index) => (
                    <div
                        key={index}
                        className={`flex flex-row justify-start gap-2 py-4 px-7 border-b-[1px] ${category === selected ? 'text-primary' : 'text-whereBlack'}`}
                        onClick={() => handleClickTab(category)}>
                        <p className="text-xl">{category}</p>
                    </div>
                ))}
            </div>

            {isShow && <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={() => setIsShow(false)}></div>}
        </>
    );
}