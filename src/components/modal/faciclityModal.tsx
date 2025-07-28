'use client'
import React, { useEffect, useState } from 'react'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { ApiItemUser } from '@/api/user'
import Image from 'next/image'
type Props = {
    open: boolean,
    current?: { id: number },
    share?: ({ id, name }: { id: number, name: string }) => void,
}
const FacilityModal = ({ open, current, share }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_items, set_items] = useState<{ id: number, name: string, image: { name: string } }[]>([])

    const getItems = async (position: string) => {
        const result = await ApiItemUser({ position, archive: "facility" })
        if (result.success) {
            set_items(result.data)
        }
    }

    useEffect(() => {
        getItems(_currentUser.position)
    }, [_currentUser.position])

    return (
        <div className={`fixed top-0 right-0 w-2/3 max-w-[768px] bg-white z-[29] shadow-lg h-full overflow-auto transition-all duration-500 p-2 ${open ? "translate-x-0" : "translate-x-[100%]"} none-scr`}>
            <div className='h-9 flex flex-col justify-center  font-bold text-lg text-org-button border-b'>施設</div>
            <div className="h-6"></div>
            {_items.map((item, index) =>
                <div className={`h-24 border border-slate-200 flex p-1 cursor-pointer rounded ${current?.id === item.id ? "!border-org-button !border-2" : ""}`} key={index} onClick={() => share && share({ id: item.id, name: item.name })}>
                    <div className='h-full aspect-square relative'>
                        <Image src={process.env.ftp_url + item.image.name} fill className='object-cover' alt='img' />
                    </div>
                    <div className='px-2 text-lg'>
                        {item.name}
                    </div>
                </div>)}
        </div>
    )
}

export default FacilityModal