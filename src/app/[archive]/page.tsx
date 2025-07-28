'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { convertArchive } from '@/lib/convert'
import { ApiItemUser } from '@/api/user'
import { UserType } from '@/redux/reducer/UserReduce'
import store from '@/redux/store'
import { Archive, ArchiveCategory, ArchiveFile } from '@/components/layout/archive'
import { useSearchParams } from 'next/navigation'
import Pagination from '@/components/layout/pagination'
const Page = () => {

    const searchParam = useSearchParams()
    const page = searchParam.get("page")
    const pageNo = page ? Number(page) : 1
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
    const [_refresh, set_refresh] = useState<number>(0)

    const getItems = async (position: string, archive: string, hostId: string, page: number, limit: number) => {
        const result = await ApiItemUser({ position, archive, hostId, skip: (page - 1) * limit, limit })
        if (result.success) {
            set_items(result.data)
        }
    }

    useEffect(() => {
        if (_currentUser && _currentUser.id) {
            getItems(_currentUser.position, archive, _currentUser.id.toString(), pageNo, 20)
        }
    }, [_currentUser, _currentUser.position, archive, _refresh, pageNo])

    const toPage = useRouter()
    return (
        <div className=''>
            <div className="font-bold uppercase h-24 flex flex-col justify-center text-center text-3xl">
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
                    <Archive items={_items} event={() => set_refresh(n => n + 1)} archive={archive} />
                    : null
            }
            <Pagination page={pageNo} end={_items.length < 20} next={() => toPage.push("?page=" + (pageNo + 1))} prev={() => toPage.push("?page=" + (pageNo - 1))} select={(x) => toPage.push("?page=" + (x))} />
        </div>
    )
}

export default Page