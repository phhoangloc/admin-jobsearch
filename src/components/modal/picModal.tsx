'use client'
import React, { useEffect, useState } from 'react'
import { ArchiveFile } from '../layout/archive'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { ApiItemUser } from '@/api/user'
type Props = {
    open: boolean
    share?: ({ id, name }: { id: number, name: string }) => void,
}
const PicModal = ({ open, share }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_items, set_items] = useState<any[]>([])
    const [_refresh, set_refresh] = useState<number>(0)

    const getItems = async (position: string) => {
        const result = await ApiItemUser({ position, archive: "file" })
        if (result.success) {
            set_items(result.data)
        }
    }

    useEffect(() => {
        getItems(_currentUser.position)
    }, [_currentUser.position, _refresh])

    return (
        <div className={`fixed top-0 right-0 w-2/3 max-w-[768px] bg-white z-3 shadow-lg h-full transition-all duration-500 p-2 ${open ? "translate-x-0" : "translate-x-[100%]"}`}>
            <div className='h-9 flex flex-col justify-center  font-bold text-lg text-org-button border-b'>写真</div>
            <ArchiveFile items={_items} event={() => set_refresh(r => r + 1)} share={(body) => share && share(body)} />
        </div>
    )
}

export default PicModal