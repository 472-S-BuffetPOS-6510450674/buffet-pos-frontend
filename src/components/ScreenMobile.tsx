'use client';

import { ReactNode } from "react";

export default function ScreenMobile({ children }: { children: ReactNode }) {
    return (
        <div className={`bg-gray-100 h-full max-w-lg mx-auto overscroll-none scrollbar-hide select-none`}>
            {children}
        </div>
    );
}

