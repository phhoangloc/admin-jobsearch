'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { convertArchive } from '@/lib/convert'
import { ApiItemUser } from '@/api/user'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { Archive, ArchiveFile } from '@/components/layout/archive'
const Page = () => {
    const params = useParams<{ archive: string }>()
    const archive = params.archive
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_warn, set_warn] = useState<string>("")

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_items, set_items] = useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_view_items, set_view_items] = useState<any[]>([])
    const [_refresh, set_refresh] = useState<number>(0)
    const [_page, set_page] = useState<number>(0)
    useEffect(() => {


        const getItems = async (position: string, archive: string, hostId: number, page: number, limit: number) => {
            const result = await ApiItemUser({ position, archive, skip: page * limit, limit, hostId: position === "admin" ? "" : hostId.toString() })
            if (result.success) {
                set_items(result.data)
            } else {
                set_warn(result.msg)
            }
        }

        if (_currentUser && _currentUser.id) {
            getItems(_currentUser.position, archive, _currentUser.id, _page, 20)
        }
    }, [_currentUser, _currentUser.position, archive, _page, _refresh])

    useEffect(() => {
        set_view_items(arr => [...arr, ..._items].filter((obj, index, self) => index === self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))))
    }, [_items])

    const [_allItemCount, set_allItemCount] = useState<number>(0)

    useEffect(() => {
        const getAllItems = async (position: string, archive: string, hostId: number) => {
            const result = await ApiItemUser({ position, archive, hostId: position === "admin" ? "" : hostId.toString() })
            if (result.success) {
                set_allItemCount(result.data.length)
            }
        }
        if (archive) {
            getAllItems(_currentUser.position, archive, _currentUser.id)
        }
    }, [_currentUser.id, _currentUser.position, archive, _refresh])

    return (
        <div className=''>
            <div className="font-bold uppercase h-12 flex flex-col justify-center text-3xl">
                {convertArchive(archive)}
            </div>
            {_warn ? <div className='text-red-500'>{_warn}<br></br>アカウントを有効にするように、管理者に連絡してください。</div> : null}
            {
                archive === "file" ?
                    <ArchiveFile items={_view_items} event={() => set_refresh(n => n + 1)} />
                    : null
            }
            {
                archive !== "category" && archive !== "file" ?
                    <Archive items={_view_items} event={() => { set_view_items([]); set_refresh(n => n + 1) }} archive={archive} allItemCount={_allItemCount} />
                    : null
            }
            {_view_items.length < _allItemCount ? <div className='flex flex-col justify-end h-12 text-center text-sm hover:underline cursor-pointer' onClick={() => set_page(n => n + 1)}>もっとみる</div> : null}
        </div>
    )
}

export default Page