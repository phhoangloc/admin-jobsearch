'use client'
import { useEffect, useState } from 'react';
import React from 'react'
import Sidebar from './sidebar'
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import store from '@/redux/store';
import { setMenu } from '@/redux/reducer/MenuReduce';
type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {

    const [_currentMenu, set_currentMenu] = useState<boolean>(store.getState().menu)

    const update = () => {
        store.subscribe(() => set_currentMenu(store.getState().menu))
    }
    useEffect(() => {
        update()
    }, [])
    return (
        <div className='w-full max-w-(--xl) m-auto overflow-hidden'>
            <div className="w-full flex">
                <div className={`w-0 overflow-hidden transition-all duration-500  ${_currentMenu ? "w-40" : "w-0 md:w-6 lg:w-40"}`}>
                    <Sidebar />
                </div>
                <div className={`w-screen md:w-(--vw-6) lg:w-(--vw-40) transition-all duration-500 min-h-screen px-2`}>
                    <div className='h-8 flex flex-col justify-center'>
                        {_currentMenu ?
                            <MenuOpenIcon className='h-7 w-7  lg:!hidden cursor-pointer text-org-button' onClick={() => { store.dispatch(setMenu(false)) }} /> :
                            <MenuIcon className='h-7 w-7  lg:!hidden cursor-pointer text-org-button' onClick={() => { store.dispatch(setMenu(true)) }} />}
                    </div>
                    <div className='h-(--vh-12)'>
                        <div className='h-(--vh-36) overflow-auto none-scr p-2'>
                            {children}
                        </div>
                        <div className='h-24 flex flex-col justify-end'>
                            システムに関するお問い合わせ<br></br>
                            株式会社アステム t-umeda@astem-co.co.jp<br></br>
                            料金・オシラ杯に関する音愛わせ　全国手話研修センター
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Layout