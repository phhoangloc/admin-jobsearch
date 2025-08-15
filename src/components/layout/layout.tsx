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
            <div className="w-full flex h-(--vh-24)">
                <div className={`w-0 overflow-hidden transition-all duration-500  ${_currentMenu ? "w-40" : "w-0 md:w-6 lg:w-40"}`}>
                    <Sidebar />
                </div>
                <div className={`w-screen md:w-(--vw-6) lg:w-(--vw-40) transition-all duration-500 h-full px-2`}>
                    <div className='h-8 flex flex-col justify-center'>
                        {_currentMenu ?
                            <MenuOpenIcon className='h-7 w-7  lg:!hidden cursor-pointer text-org-button' onClick={() => { store.dispatch(setMenu(false)) }} /> :
                            <MenuIcon className='h-7 w-7  lg:!hidden cursor-pointer text-org-button' onClick={() => { store.dispatch(setMenu(true)) }} />}
                    </div>
                    <div className='h-(--full-12) overflow-scroll none-scr'>
                        {/* <div className='h-full overflow-auto none-scr p-2'> */}
                        {children}
                        {/* </div> */}
                    </div>

                </div>

            </div>
            <div className="fixed w-screen h-24 bottom-0 left-0 bg-white ">
                <div className='w-full max-w-(--xl) h-full m-auto flex flex-col justify-end text-sm lg:text-base p-2'>
                    <p className='leading-5 opacity-85'>
                        システムに関する問い合わせ：<br className='block lg:hidden'></br>
                        株式会社アステム inquery@astem-co.co.jp
                    </p>
                    <p className='leading-5 opacity-85'>
                        料金・登録に関するお問い合わせ：<br className='block lg:hidden'></br>
                        全国手話研修センター　syuwakentei@com-sagano.com
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Layout