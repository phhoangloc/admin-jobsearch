'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import store from '@/redux/store'
import { UserType } from '@/redux/reducer/UserReduce'
import { ApiItemUser } from '@/api/user'
import { convertArchive } from '@/lib/convert'
import { DetailFacility, DetailInterview, DetailNews, DetailPost, DetailUser } from '@/components/layout/detail'
const Page = () => {
    const params = useParams<{ archive: string, slug: string }>()
    const archive = params.archive
    const slug = params.slug

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [_item, set_item] = useState<any>()

    const [_refresh, set_refresh] = useState<number>(0)
    useEffect(() => {
        const getItem = async (position: string, archive: string, slug: string, hostId: string) => {
            if (archive === "user") {
                if (_currentUser.position === "user") {
                    const result = await ApiItemUser({ position, archive, id: Number(slug) })
                    if (result.success) {
                        set_item(result.data)
                    }
                } else {
                    const result = await ApiItemUser({ position, archive, id: Number(slug) })
                    if (result.success) {
                        set_item(result.data[0])
                    }
                }
            } else {
                const result = await ApiItemUser({ position, archive, hostId, slug })
                if (result.success) {
                    set_item(result.data[0])
                }
            }

        }
        if (_currentUser) {
            getItem(_currentUser.position, archive, slug, _currentUser.id.toString())
        }
    }, [_currentUser, _currentUser.position, archive, slug, _refresh])

    return (
        <div className='bg-white rounded-lg shadow-md p-2'>
            <div className="font-bold uppercase h-24 flex flex-col justify-center text-center text-3xl">
                {convertArchive(archive)}{slug === "news" ? "登録" : null}
            </div>
            {archive === "user" && _item ? <DetailUser user={_item} /> : null}
            {archive === "news" && (_item || slug === "news") ? <DetailNews item={_item} event={() => set_refresh(n => n + 1)} archive={archive} /> : null}
            {archive === "facility" && (_item || slug === "news") ? <DetailFacility item={_item} event={() => set_refresh(n => n + 1)} archive={archive} /> : null}
            {archive === "post" && (_item || slug === "news") ? <DetailPost item={_item} event={() => set_refresh(n => n + 1)} archive={archive} /> : null}
            {archive === "interview" && (_item || slug === "news") ? <DetailInterview item={_item} event={() => set_refresh(n => n + 1)} archive={archive} /> : null}
        </div>
    )
}

export default Page