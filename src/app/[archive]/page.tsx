'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { convertArchive } from '@/lib/convert'
import { ApiItemUser } from '@/api/user'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { Archive, ArchiveCategory, ArchiveFile } from '@/components/layout/archive'
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_items, set_items] = useState<any[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_view_items, set_view_items] = useState<any[]>([])
    const [_refresh, set_refresh] = useState<number>(0)
    const [_page, set_page] = useState<number>(0)
    const getItems = async (position: string, archive: string, hostId: string, page: number, limit: number) => {
        const result = await ApiItemUser({ position, archive, hostId, skip: page * limit, limit })
        if (result.success) {
            set_items(result.data)
        }
    }

    useEffect(() => {
        if (_currentUser && _currentUser.id) {
            getItems(_currentUser.position, archive, _currentUser.id.toString(), _page, 10)
        }
    }, [_currentUser, _currentUser.position, archive, _page])

    useEffect(() => {
        set_view_items(arr => [...arr, ..._items].filter((obj, index, self) => index === self.findIndex((o) => JSON.stringify(o) === JSON.stringify(obj))))
    }, [_items, _refresh])

    const [_allItemCount, set_allItemCount] = useState<number>(0)

    const getAllItems = async (position: string, archive: string, hostId: string,) => {
        const result = await ApiItemUser({ position, archive, hostId, })
        if (result.success) {
            set_allItemCount(result.data.length)
        }
    }
    useEffect(() => {
        if (archive) {
            getAllItems(_currentUser.position, archive, _currentUser.id.toString())
        }
    }, [_currentUser.id, _currentUser.position, archive])

    return (
        <div className=''>
            <div className="font-bold uppercase h-12 flex flex-col justify-center text-3xl">
                {convertArchive(archive)}
            </div>

            {
                archive === "category" ?
                    <ArchiveCategory items={_items} event={() => set_refresh(n => n + 1)} />
                    : null
            }
            {
                archive === "file" ?
                    <ArchiveFile items={_items} event={() => set_refresh(n => n + 1)} />
                    : null
            }
            {
                archive !== "category" && archive !== "file" ?
                    <Archive items={_view_items} event={() => set_refresh(n => n + 1)} archive={archive} allItemCount={_allItemCount} />
                    : null
            }
            {_view_items.length < _allItemCount ? <div className='flex flex-col justify-end h-12 text-center text-sm hover:underline cursor-pointer' onClick={() => set_page(n => n + 1)}>もっとみる</div> : null}
        </div>
    )
}

export default Page