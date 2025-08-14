/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { ApiCreateItem, ApiDeleteItem, ApiUploadFile } from '@/api/user';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { useRouter } from 'next/navigation';
import { UploadButton } from '../button/button';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { convertArchive } from '@/lib/convert';
import ShareIcon from '@mui/icons-material/Share';
import { ModalType, setModal } from '@/redux/reducer/ModalReduce';
type CategoryProps = {
    items: { id: number, name: string, archive: string }[]
    event: () => void
}
export const ArchiveCategory = ({ items, event }: CategoryProps) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_isAddNewCategory, set_isAddNewCategory] = useState<boolean>(false)
    const [_category, set_category] = useState<string>("")

    const addNewCategory = async () => {
        if (_isAddNewCategory) {
            const result = await ApiCreateItem({ position: _currentUser.position, archive: "category" }, { name: _category })
            if (result.success) {
                event()
                set_category("")
                set_isAddNewCategory(false)

            }

        }
    }
    const deleteCategory = async (id: number) => {
        const result = await ApiDeleteItem({ position: _currentUser.position, archive: "category", id })
        if (result.success) {
            event()
        }
    }

    return (
        <div>
            <div className='flex py-2 gap-1'>
                <input className={`border-org-button bg-white transition-all duration-300 ${_isAddNewCategory ? "w-72 border" : "w-0"}`} placeholder='新規カテゴリー' onChange={(e) => set_category(e.currentTarget.value)} value={_category}></input>
                <button className={`block m-0 w-max bg-org-button text-white px-2 rounded cursor-pointer shadow-md ${_isAddNewCategory ? "hidden" : "block"}`} onClick={() => { set_isAddNewCategory(true) }}>新規カテゴリー</button>
                <button className={`block m-0 w-max bg-org-button text-white px-2 rounded cursor-pointer shadow-md disabled:opacity-25 ${_isAddNewCategory ? "block" : "hidden"}`} disabled={!_category} onClick={() => { addNewCategory() }}>登録</button>
                <button className={`block m-0 w-max bg-org-button text-white px-2 rounded cursor-pointer shadow-md ${_isAddNewCategory ? "block" : "hidden"}`} onClick={() => { set_isAddNewCategory(false) }}>キャンセル</button>
            </div>
            <div className="bg-white shadow rounded">
                {
                    items.map((it, index) =>
                        <div className='h-9 flex justify-between even:backdrop-brightness-95 p-2 cursor-pointer'
                            key={index}>
                            <div>
                                {it.name}
                            </div>
                            <DeleteIcon className='text-org-button' onClick={() => deleteCategory(it.id)} />
                        </div>
                    )
                }

            </div>
        </div>

    )
}
type Props = {
    items: any[]
    allItemCount?: number
    event: () => void,
    archive?: string,
    share?: ({ id, name }: { id: number, name: string }) => void,
}
export const Archive = ({ items, allItemCount, event, archive }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)
    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
        store.subscribe(() => set_currentModal(store.getState().modal))
    }
    useEffect(() => {
        update()
    }, [])

    const [_id, set_id] = useState<number>(0)
    useEffect(() => {
        const deleteItem = async (archive: string, id: number) => {
            const result = await ApiDeleteItem({ position: _currentUser.position, archive, id })
            if (result.success) {
                store.dispatch(setModal({ open: true, value: "", msg: "削除成功！", type: "notification" }))
                setTimeout(() => {
                    store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                }, 3000);
                if (event) {
                    event()
                }
            } else {
                console.log(result.data)
                store.dispatch(setModal({ open: true, value: "", msg: "エラー", type: "notification" }))

                setTimeout(() => {
                    store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                }, 3000);
            }

        }
        if (archive && _id && _currentModal.value === "yes") {
            deleteItem(archive, _id)
        }
    }, [_currentUser.position, _id, archive, event, _currentModal])

    const toPage = useRouter()

    return (
        <div >
            {archive ?
                <div className='flex py-2 justify-between pb-4 border-b-2 border-b-org-button/50'>
                    <div className='block m-0 w-max px-2 rounded cursor-pointer' onClick={() => { toPage.push(archive + "/news") }}>{items.length}{allItemCount ? " / " + allItemCount : " "} 件の{convertArchive(archive)}があります</div>
                    <div className='block m-0 w-max px-2 rounded cursor-pointer bg-org-button text-white' onClick={() => { toPage.push(archive + "/news") }}>新規{convertArchive(archive)}</div>
                </div> :
                null}
            <div className="h-6"></div>
            <div className="bg-white shadow rounded ">
                <div className='h-9'>
                    <div className='h-full px-2 flex flex-col justify-center font-bold'>タイトル/名前</div>
                </div>
                {
                    items.map((it, index) =>
                        <div className='grid grid-cols-12 even:bg-slate-100 p-2 cursor-pointer'
                            key={index}>
                            <div onClick={() => !it.slug ? toPage.push("user/" + it.id) : toPage.push(it.archive + "/" + it.slug)} className='w-full max-w-96 line-clamp-1 col-span-10'>
                                {it.name || it.username || it.title}
                            </div>
                            <div className='col-span-1 text-center'>{it.draft ? "下書き" : "公開"}</div>
                            {/* <div className='opacity-50 text-sm w-12'>{it.position ? it.position : null}</div> */}
                            <div className="col-span-1">
                                <DeleteIcon className='text-org-button m- !block' onClick={() => { store.dispatch(setModal({ open: true, type: "confirm", msg: "ニュースを削除してもよろしいでしょうか。", value: "" })); set_id(it.id) }} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export const ArchiveFile = ({ items, event, share }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])

    const [_select, set_select] = useState<number>(-1)

    const getFile = async (e: any) => {
        const files = e.target.files;
        const file: File | undefined = files ? files[0] : undefined
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = async function () {
                const result = await ApiUploadFile({ position: _currentUser.position, archive: "file", file })
                if (result.success) {
                    store.dispatch(setModal({ open: true, value: "", msg: "作成成功！", type: "notification" }))
                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);
                    if (event) {
                        event()
                    }
                } else {
                    console.log(result.data)
                    store.dispatch(setModal({ open: true, value: "", msg: "エラー", type: "notification" }))

                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);
                }
            }
        }

    }
    const deleteImage = async (position: string, archive: string, id: number) => {
        const result = await ApiDeleteItem({ position, archive, id })
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "削除成功！", type: "notification" }))
            setTimeout(() => {
                set_select(-1)
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);
            if (event) {
                event()
            }
        } else {
            console.log(result.data)
            store.dispatch(setModal({ open: true, value: "", msg: "エラー", type: "notification" }))

            setTimeout(() => {
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);
            event()
        }
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 p-2 ">
            <div className=' aspect-square flex flex-col justify-center shadow border border-slate-200 rounded bg-white'>
                <UploadButton sx='!w-12 !h-12 m-auto' name={<AddIcon className='!h-full !w-full text-sky-600 cursor-pointer' />} onClick={(e) => getFile(e)} />
            </div>
            {items.map((item, index) =>
                <div key={index} className={`relative  aspect-square flex flex-col justify-end  border-slate-200  `}>
                    <div className={`bg-white cursor-pointer transition-all duration-200 ${index === _select ? "shadow-md -translate-y-8" : "shadow"} absolute top-0 w-full h-full rounded border border-slate-300`} onClick={() => set_select(n => n !== index ? index : -1)}>
                        <Image src={process.env.ftp_url + item.name} fill className="object-cover" alt={item.name} />
                    </div>
                    <div className="flex justify-between">

                        <ShareIcon className='!w-6 !h-6 !block hover:text-sky-600' onClick={() => share && share({ id: item.id, name: item.name })} />
                        <DeleteIcon className='!w-6 !h-6 !block ml-auto mr-0 hover:text-sky-600' onClick={() => deleteImage(_currentUser.position, "file", item.id)} />
                    </div>
                </div>
            )}
        </div>
    )
}