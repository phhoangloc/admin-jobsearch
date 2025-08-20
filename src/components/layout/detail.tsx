'use client'
import { UserType } from '@/redux/reducer/UserReduce'
import React, { useEffect, useState } from 'react'
import { Input } from '../input/input'
import { Button, UploadButton } from '../button/button'
import { ApiCreateItem, ApiUpdateItem, ApiUploadFile } from '@/api/user'
import store from '@/redux/store'
import { setRefresh } from '@/redux/reducer/RefreshReduce'
import TextArea from '../input/textarea'
import { ApiItem, getAddress } from '@/api/client'
import { japanRegions } from '@/lib/area'
import Image from 'next/image'
import FacilityModal from '../modal/faciclityModal'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { setModal } from '@/redux/reducer/ModalReduce'
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { licenseList, workstatusList, worktypeList } from '@/lib/workstatus'
import UploadIcon from '@mui/icons-material/Upload';
type Props = {
    user: UserType,
}
export const DetailUser = ({ user }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])
    const param = useParams<{ archive: string, slug: string }>()
    const slug = param.slug
    const [_username, set_username] = useState<string>("")
    const [_email, set_email] = useState<string>("")
    const [_password, set_password] = useState<string>("")
    const [_facilityLimit, set_facilityLimit] = useState<number>(0)
    const [_edit_facility, set_edit_facility] = useState<number[]>([])
    const [_edit_facility_name, set_edit_facility_name] = useState<string[]>([])
    const [_newExpired, set_newExpired] = useState<Date>()

    const body = {
        username: _username || user.username,
        email: _email || user.email,
        password: _password || undefined,
        facilitieslimit: Number(_facilityLimit) || user.facilitieslimit,
        active: true,
        edit_facility: _edit_facility,
        expiredAt: _newExpired
    }
    const updateUser = async (body: {
        password?: string;
        facilitieslimit: number;
    }) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: "user", id: user.id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, msg: "更新成功！", value: "", type: "notification" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, msg: "", value: "", type: "" }))
                store.dispatch(setRefresh())
            }, 3000);

        } else {
            console.log(result.data)
            store.dispatch(setModal({ open: true, msg: "エラー", value: "", type: "notificaiton" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, msg: "", value: "", type: "" }))
            }, 3000);
        }
    }

    const toPage = useRouter()
    const create = async (body: {
        username: string;
        email: string;
        password?: string;
        active: boolean;
        facilitieslimit: number;
    }) => {
        const result = await ApiCreateItem({ position: "admin", archive: "user" }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "作成成功！", type: "notification" }))
            setTimeout(() => {
                toPage.back()
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);

        } else {
            console.log(result.data)
            store.dispatch(setModal({ open: true, value: "", msg: "エラー", type: "notification" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);
        }
    }

    useEffect(() => {
        set_facilityLimit(user.facilitieslimit)
        set_edit_facility(user.editfacilities.map(f => f.facilityId))
        set_edit_facility_name(user.editfacilities.map(f => f.facility.name))
    }, [user])

    const [_modalFacility, set_modalFacility] = useState<boolean>(false)
    const [_extend, set_extend] = useState<string>('0mth')


    useEffect(() => {
        if (!_extend || _extend === "0mth") {
            set_newExpired(user.expiredAt)
        }
        if (_extend === "6mth") {
            // console.log(moment(user.expiredAt).utc().add(6, 'months').format("YYYY年MM月DD日"))
            set_newExpired(moment(user.expiredAt).add(6, 'months').toDate())
        }
        if (_extend === "12mth") {
            // console.log(moment(user.expiredAt).utc().add(1, 'years').format("YYYY年MM月DD日"))
            set_newExpired(moment(user.expiredAt).add(12, 'months').toDate())
        }
    }, [_extend, user.expiredAt])

    return (
        slug === "news" ?
            <div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-28'>ユーザー</div>
                    <Input onchange={v => set_username(v)} value={""} sx='!w-72 !m-0' />
                </div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-28'>メール</div>
                    <Input onchange={v => set_email(v)} value={""} sx='!w-72 !m-0' />
                </div>
                <div className='flex gap-2 mb-2'>
                    <div className='w-28'>パスワード</div>
                    <Input type='password' onchange={v => set_password(v)} value={""} sx='!w-72 !m-0' />
                </div>
                <Button name="作成" sx='!bg-org-button' disable={!_username || !_email || !_password} onClick={() => { create(body) }} />
            </div>
            :
            <div>
                <FacilityModal open={_modalFacility} share={(facility) => {
                    set_edit_facility(crr => crr.includes(facility.id) ? crr.filter(cr => cr !== facility.id) : [...crr, facility.id]);
                    set_edit_facility_name(crr => crr.includes(facility.name) ? crr.filter(cr => cr !== facility.name) : [...crr, facility.name]);
                }} currents={_edit_facility} close={() => set_modalFacility(false)} />

                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-28'>ユーザー</div>
                    <div className='flex flex-col justify-center w-72 border border-slate-200 px-2 bg-white'>{user.username}</div>
                </div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-28'>メール</div>
                    <div className='flex flex-col justify-center w-72 border border-slate-200 px-2 bg-white'>{user.email}</div>
                </div>
                <div className="h-3"></div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-44'>新しいパスワード</div>
                    <Input type='password' onchange={v => set_password(v)} value={_password} sx='!w-72 !m-0' />
                </div>
                <div>
                    {_currentUser.position === "admin" ?
                        <div className='mt-12 border rounded-md border-slate-300 bg-white'>
                            <div className='flex h-12 justify-between bg-org-button/10 px-2'>
                                <div className='h-full flex flex-col justify-center font-bold text-xl  '>施設</div>
                                <AddIcon className='!w-12 !h-12 p-2 cursor-pointer' onClick={() => set_modalFacility(!_modalFacility)} />
                            </div>
                            {
                                _edit_facility_name.map((faName, index) => <div className='px-2 h-8 flex flex-col justify-center' key={index}>{faName}</div>)
                            }
                        </div>
                        :
                        null}

                </div>
                <div className="h-12"></div>
                <div>
                    有効期限を延長:
                </div>
                {_currentUser.position !== "user" ?
                    <>
                        <div className="flex gap-4">
                            <div >
                                < input type='radio' className='mr-1' value={"0mth"} checked={_extend === "0mth"} onChange={(e) => set_extend(e.target.value)} ></input>延長なし
                            </div>
                            <div >
                                < input type='radio' className='mr-1' value={"6mth"} checked={_extend === "6mth"} onChange={(e) => set_extend(e.target.value)} ></input>6ヶ月
                            </div>
                            <div>
                                < input type='radio' className='mr-1' value={"12mth"} checked={_extend === "12mth"} onChange={(e) => set_extend(e.target.value)}></input>1年間
                            </div>
                        </div>
                        <div>
                            作成日: {moment(user.createdAt).utc().format("YYYY年MM月DD日")}
                        </div>
                        <div>
                            有効期限: {moment(_newExpired).utc().format("YYYY年MM月DD日")}
                        </div>
                    </> :
                    null}
                <div>
                    <Button name="保存" sx='!bg-org-button' disable={!_password && !_facilityLimit} onClick={() => { updateUser(body) }} />
                </div>
            </div>
    )
}
type NewsProps = {
    item?: {
        id: number,
        archive: string,
        name: string,
        slug: string,
        content: string,
        categoryId: number,
        category: {
            name: string
        }
    },
    event: () => void
    archive?: string
}
export const DetailNews = ({ item, event, archive }: NewsProps) => {
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_id, set_id] = useState<number>(0)
    const [_archive, set_archive] = useState<string>("")
    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_categoryId, set_categoryId] = useState<number>(0)

    useEffect(() => {
        if (item) {
            set_id(item.id)
            set_archive(item.archive)
            set_name(item.name)
            set_slug(item.slug)
            set_content(item.content)
            set_categoryId(item.categoryId)
        } else {
            set_slug("new_" + moment(new Date).format("YYYY_MM_DD_hh_mm_ss"))
        }
    }, [item])

    const body = {
        name: _name,
        slug: _slug,
        content: _newContent || _content,
        categoryId: _categoryId || 11,

    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = async (body: any) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: _archive, id: _id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "更新成功！", type: "notification" }))
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
    const createItem = async (body: unknown) => {
        const result = await ApiCreateItem({ position: _currentUser.position, archive: archive }, body)
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

    const toPage = useRouter()

    return (
        <div>
            <div className='mb-2'>
                <div className='font-bold text-sm'>タイトル</div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className='font-bold text-sm'>ニュースの内容</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>

            <div className="flex gap-1">
                <Button name="戻る" sx='!bg-white !text-org-button border-2 !m-0' onClick={() => { toPage.back() }} />
                {item ? <Button name="保存" sx='!bg-org-button !m-0' onClick={() => { updateItem(body) }} /> : <Button name="作成" sx='!bg-org-button !m-0' onClick={() => { createItem(body) }} />}
            </div>

        </div>
    )
}
type FacilityProps = {
    item?: {
        id: number,
        archive: string,
        name: string,
        slug: string,
        worktype: string,
        postno: string,
        content: string,
        contenttitle: string,
        imageId: number,
        image: {
            name: string
        },
        address: string,
        location: string,
        area: string,
        phone: string,
        fax: string,
        email: string,
        homepage: string,
        map: string,
        video: string,
        draft: boolean,
    },
    event: () => void
    archive?: string
}
export const DetailFacility = ({ item, event, archive }: FacilityProps) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_id, set_id] = useState<number>(0)
    const [_archive, set_archive] = useState<string>("")
    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_worktype, set_worktype] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_contenttitle, set_contenttitle] = useState<string>("")
    const [_postno, set_postno] = useState<string>("")
    const [_postnoWarn, set_postnoWarn] = useState<string>("")
    const [_postnoKey, set_postnoKey] = useState<number>(0)
    const [_address, set_address] = useState<string>("")
    const [_location, set_location] = useState<string>("")
    const [_area, set_area] = useState<string>("")
    const [_phone, set_phone] = useState<string>("")
    const [_phoneWarn, set_phoneWarn] = useState<string>("")
    const [_phoneView, set_phoneView] = useState<string>("")
    const [_phoneKey, set_phoneKey] = useState<number>(0)

    const [_fax, set_fax] = useState<string>("")
    const [_faxWarn, set_faxWarn] = useState<string>("")
    const [_faxView, set_faxView] = useState<string>("")
    const [_faxKey, set_faxKey] = useState<number>(0)
    const [_email, set_email] = useState<string>("")
    const [_emailWarn, set_emailwarn] = useState<string>("")
    const [_homepage, set_homepage] = useState<string>("")
    const [_map, set_map] = useState<string>("")
    const [_video, set_video] = useState<string>("")

    const [_draft, set_draft] = useState<boolean>(false)

    const [_imagePreview, set_imagePreview] = useState<string>("")
    const [_imageId, set_imageId] = useState<number>(0)


    useEffect(() => {
        if (item) {
            set_id(item.id)
            set_archive(item.archive)
            set_name(item.name)
            set_slug(item.slug)
            set_worktype(item.worktype)
            set_postno(item.postno)
            set_content(item.content)
            set_contenttitle(item.contenttitle)
            set_imageId(item.imageId)
            set_imagePreview(process.env.ftp_url + item.image.name)
            set_address(item.address)
            set_location(item.location)
            set_area(item.area)
            set_phone(item.phone)
            set_fax(item.fax)
            set_email(item.email)
            set_homepage(item.homepage)
            set_map(item.map)
            set_video(item.video)
            set_draft(item.draft)
        } else {
            set_slug("facility_" + moment(new Date()).format("YYYY_MM_DD_hh_mm_ss"))
        }
    }, [item])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        const files = e.target.files;
        const file: File | undefined = files ? files[0] : undefined
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = async function () {
                const result = await ApiUploadFile({ position: _currentUser.position, archive: "file", file })
                if (result.success) {
                    store.dispatch(setModal({ open: true, value: "", msg: "アップロード成功！", type: "notification" }))
                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);
                    set_imageId(result.data.id)
                    set_imagePreview(process.env.ftp_url + result.data.name)
                    if (event) {
                        event()
                    }
                } else {
                    store.dispatch(setModal({ open: true, value: "", msg: "エラー", type: "notification" }))

                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);

                }
            }
        }

    }

    const body = {
        name: _name,
        slug: _slug,
        content: _newContent || _content,
        contenttitle: _contenttitle,
        worktype: _worktype,
        postno: _postno,
        address: _address,
        location: _location,
        imageId: _imageId || 4,
        area: _area,
        phone: _phone,
        fax: _fax,
        email: _email,
        homepage: _homepage,
        map: _map,
        video: _video,
        draft: _draft,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = async (id: number, body: any) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: _archive, id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "更新成功！", type: "notification" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);
            if (id != 84 && event) {
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
    const createItem = async (body: unknown) => {
        const result = await ApiCreateItem({ position: _currentUser.position, archive: archive }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "作成成功！", type: "notification" }))
            setTimeout(() => {
                toPage.back()
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
    const formatPostNo = (input: string) => {
        const digits = input.replace(/\D/g, '');
        if (digits.length === 7) {
            set_postnoWarn("")
            set_postnoKey(k => k + 1)
            return digits.replace(/(\d{3})(\d{4})/, '$1-$2');
        } else {
            set_postnoWarn("入力した郵便番号は適切ではありません")
            return input;
        }

    }
    const formatArea = (input: string) => {
        if (input) {
            japanRegions.map(r => {
                if (r.prefectures.filter(p => p.name === input).length) {
                    set_area(r.region);
                }
            })
        } else {
            return ""
        }
    }
    const formatPhoneNumber = (input: string) => {
        if (input) {
            const digits = input.replace(/\D/g, '');

            if (digits.length === 10) {
                set_phoneWarn("")
                set_phoneKey(k => k + 1)

                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (digits.length === 11) {
                set_phoneWarn("")
                set_phoneKey(k => k + 1)
                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else {
                set_phoneWarn("電話番号は適切ではありません")
                return input;
            }
        } else {
            set_phoneWarn("")
            return ""
        }
    }
    const formatFaxNumber = (input: string) => {
        if (input) {
            const digits = input.replace(/\D/g, '');

            if (digits.length === 10) {
                set_faxWarn("")
                set_faxKey(k => k + 1)

                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (digits.length === 11) {
                set_faxWarn("")
                set_faxKey(k => k + 1)

                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else {
                set_faxWarn("ファクスは適切ではありません")
                return input;
            }
        } else {
            set_faxWarn("")
            return ""
        }
    }
    const getAddressFacility = async (pNo: string) => {
        const result = await getAddress(pNo)
        if (result.results?.length) {
            set_address(result.results[0].address1 + result.results[0].address2 + result.results[0].address3)
            set_location(result.results[0].address1)
        }
    }
    const ValidateEmail = (input: string) => {
        if (!/\S+@\S+\.\S+/.test(input) && input?.length) {
            set_emailwarn('電子メールが無効です');
        } else {
            set_emailwarn("")
        }
    }
    useEffect(() => {
        if (!_postno) { return }
        const digits = _postno.replace(/\D/g, '');
        if (digits.length === 7) {
            getAddressFacility(digits)
        }
        set_postno(formatPostNo(digits))
    }, [_postno])
    useEffect(() => {
        set_phoneView(formatPhoneNumber(_phone))
    }, [_phone])
    useEffect(() => {
        set_faxView(formatFaxNumber(_fax))
    }, [_fax])
    useEffect(() => {
        formatArea(_location)
    }, [_location])
    useEffect(() => {
        ValidateEmail(_email)
    }, [_email])

    const toPage = useRouter()


    return (
        <div>
            <div className='mb-2'>
                <div className=' '>施設名 <span className='text-sm text-red-500'>必須</span></div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=' '>キャッチコピー（自由にご記入ください）</div>
                <Input onchange={v => set_contenttitle(v)} value={_contenttitle} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>アイキャッチ画像<span className='text-sm opacity-50 italic'>（最大アップロードサイズ 2 MB）</span></div>
                <div className='w-max flex justify-between'>
                    <UploadButton name={<div className='border rounded-3xl py-1 px-4 bg-white'><UploadIcon /> ファイルをアップロード</div>} onClick={(e) => getFile(e)} />
                </div>
                {
                    _imagePreview ?
                        <div className='w-full max-w-(--xs)'>
                            <ClearIcon className='!w-12 !h-12 p-2 cursor-pointer text-red-500 !block ml-auto mr-0' onClick={() => {
                                set_imageId(4)
                                set_imagePreview("")
                            }} />
                            <Image src={_imagePreview} width="200" height="200" className='w-full' alt='img' />

                        </div>
                        : null
                }
            </div>
            <div className='mb-2'>
                <div className=''>郵便番号 <span className='text-sm text-red-500'>必須</span></div>
                <Input key={_postnoKey} onchange={v => { set_postno(v) }} value={_postno} sx='!w-full !m-0' />
                <p className='text-red-500 text-xs'>{_postnoWarn}</p>
            </div>
            <div className='mb-2'>
                <div className=''>地域（自動で入力されます）</div>
                <Input onchange={v => set_area(v)} value={_area} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>都道府県（自動で入力されます）</div>
                <Input onchange={v => set_location(v)} value={_location} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>住所 <span className='text-sm text-red-500'>必須</span></div>
                <Input onchange={v => set_address(v)} value={_address} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>電話番号 <span className='text-sm text-red-500'>必須</span></div>
                <Input key={_phoneKey} onchange={v => set_phone(v)} value={_phoneView} sx='!w-full !m-0' />
                <p className='text-red-500 text-xs'>{_phoneWarn}</p>

            </div>
            <div className='mb-2'>
                <div className=''>FAX</div>
                <Input key={_faxKey} onchange={v => set_fax(v)} value={_faxView} sx='!w-full !m-0' />
                <p className='text-red-500 text-xs'>{_faxWarn}</p>
            </div>
            <div className='mb-2'>
                <div className=''>Email</div>
                <Input onchange={v => set_email(v)} value={_email} sx='!w-full !m-0' />
                <p className='text-red-500 text-xs'>{_emailWarn}</p>
            </div>
            <div className='mb-2'>
                <div className=''>ウェブサイト</div>
                <Input onchange={v => set_homepage(v)} value={_homepage} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>Google MapsのURL</div>
                <Input onchange={v => set_map(v)} value={_map} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>紹介動画 YouTube URL</div>
                <Input onchange={v => set_video(v)} value={_video} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>施設の紹介をご記入ください</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>

            <div className='bg-white p-2 border border-slate-300 shadow rounded'>
                <div className='mb-2 flex h-12 gap-2 my-2'>
                    <div className='h-full flex flex-col justify-center'>状態 : </div>
                    <div className='col-span-1 bg-white h-12 border  rounded active:outline-0 border-slate-300 w-20'>
                        <select onChange={(e) => set_draft(e.target.value === "1" ? true : false)} value={_draft ? 1 : 0} className='pt-2 w-full flex flex-col justify-center h-full'>
                            {/* <option className='h-12 flex flex-col justify-center' value={""}>{"---"}</option> */}
                            {[{ name: "下書き", value: 1 }, { name: "公開", value: 0 }].map((item, index) =>
                                <option className='text-black' key={index} value={item.value} >{item.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button name="戻る" sx='!bg-white !text-org-button border-1 !m-0 !w-20' onClick={() => { toPage.back() }} />
                    <Button name="プレビュー" sx='!bg-white !text-org-button border-1 !m-0 !w-24 text-sm' onClick={async () => { const newBody = body; newBody.slug = "_preview"; await updateItem(84, body); window.open(process.env.home_url + "/facility/_preview?archivePlus=facility_preview", "_blank") }} />

                    {item ?
                        <Button name={"保存"} sx='!bg-org-button !m-0' onClick={() => { updateItem(_id, body) }} /> :
                        <Button name="作成" sx='!bg-org-button !m-0' disable={!_name || !_postno || !_phone || !_address} onClick={() => { createItem(body) }} />}
                </div>
            </div>
        </div>
    )
}
type PostProps = {
    item?: {
        id: number,
        archive: string,
        title: string,
        slug: string,
        worktype: string,
        tag: {
            postId: number,
            tag: {
                id: number,
                name: string
            }
        }[],
        workstatus: string,
        worktime: string,
        worksalary: string,
        bonus: string,
        contract: string,
        contractName: string,
        workbenefit: string,
        lisense: string,
        dayoff: string,
        content: string,
        contenttitle: string,
        imageId: number,
        image: {
            name: string
        },
        workplaceId: number,
        workplace: {
            name: string
        },
        startDate: Date,
        endDate: Date
        draft: boolean,
    },
    event: () => void
    archive?: string
}
export const DetailPost = ({ item, event, archive }: PostProps) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_id, set_id] = useState<number>(0)
    const [_archive, set_archive] = useState<string>("")
    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_contract, set_contract] = useState<string>("")
    const [_contractWarn, set_contractWarn] = useState<string>("")
    const [_contractName, set_contractName] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_worktype, set_worktype] = useState<string>("")
    const [_worktag, set_worktag] = useState<{ id: number, name: string }[]>([])
    const [_workstatus, set_workstatus] = useState<string>("")
    const [_workplaceName, set_workplaceName] = useState<string>("")
    const [_workplaceId, set_workplaceId] = useState<number>(0)
    const [_worktime, set_worktime] = useState<string>("")
    const [_workSalary, set_workSalary] = useState<string>("")
    const [_bonus, set_bonus] = useState<string>("")
    const [_workbenefit, set_workbenefit] = useState<string>("")
    const [_lisense, set_lisense] = useState<string>("")
    const [_dayoff, set_dayoff] = useState<string>("")
    const [_startDate, set_startDate] = useState<Date>(new Date())
    const [_endDate, set_endDate] = useState<Date>(new Date())
    const [_draft, set_draft] = useState<boolean>(false)

    const [_modalFacility, set_modalFacility] = useState<boolean>(false)
    const [_imagePreview, set_imagePreview] = useState<string>("")
    const [_imageId, set_imageId] = useState<number>(0)


    useEffect(() => {
        if (item) {
            set_id(item.id)
            set_archive(item.archive)
            set_name(item.title)
            set_slug(item.slug)
            set_worktype(item.worktype)
            set_worktag(item.tag.map(t => t.tag))
            set_workstatus(item.workstatus)
            set_content(item.content)
            set_contract(item.contract)
            set_contractName(item.contractName)
            set_imageId(item.imageId)
            set_imagePreview(process.env.ftp_url + item.image.name)
            set_workplaceId(item.workplaceId)
            set_workplaceName(item.workplace.name)
            set_worktime(item.worktime)
            set_workSalary(item.worksalary)
            set_bonus(item.bonus)
            set_workbenefit(item.workbenefit)
            set_lisense(item.lisense)
            set_dayoff(item.dayoff)
            set_startDate(item.startDate)
            set_endDate(item.endDate)
            set_draft(item.draft)
        } else {
            set_slug("post_" + moment(new Date).format("YYYY_MM_DD_hh_mm_ss"))
        }
    }, [item])

    const body = {
        title: _name,
        slug: _slug,
        content: _newContent || _content,
        contract: _contract,
        contractName: _contractName,
        worktype: _worktype,
        tagIds: _worktag.map(t => t.id),
        workstatus: _workstatus,
        worktime: _worktime,
        worksalary: _workSalary,
        bonus: _bonus,
        workbenefit: _workbenefit,
        imageId: _imageId || 4,
        facilityId: _workplaceId,
        lisense: _lisense,
        dayoff: _dayoff,
        startDate: new Date(_startDate),
        endDate: new Date(_endDate),
        draft: _draft
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = async (id: number, body: any) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: _archive, id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "更新成功！", type: "notification" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);
            if (id != 7 && event) {
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
    const createItem = async (body: unknown) => {
        const result = await ApiCreateItem({ position: _currentUser.position, archive: archive }, body)
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
    const ValidateEmail = (input: string) => {
        if (!/\S+@\S+\.\S+/.test(input) && input?.length) {
            set_contractWarn('電子メールが無効です');
        } else {
            set_contractWarn("")
        }
    }
    useEffect(() => {
        ValidateEmail(_contract)
    }, [_contract])

    const toPage = useRouter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        const files = e.target.files;
        const file: File | undefined = files ? files[0] : undefined
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = async function () {
                const result = await ApiUploadFile({ position: _currentUser.position, archive: "file", file })
                if (result.success) {
                    store.dispatch(setModal({ open: true, value: "", msg: "削除成功！", type: "notification" }))
                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);
                    set_imageId(result.data.id)
                    set_imagePreview(process.env.ftp_url + result.data.name)
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

    const [_refresh, set_refresh] = useState<number>(0)

    const [_tag, set_tag] = useState<{ id: number, name: string }[]>([])
    const getTag = async () => {
        const result = await ApiItem({ archive: "tag" })
        if (result.success) {
            set_tag(result.data)
        }
    }
    useEffect(() => {
        getTag()
    }, [_refresh])

    const [_openTagModal, set_openTagModal] = useState<boolean>(false)
    const [_newTag, set_newTag] = useState<string>("")

    const createTag = async (name: string) => {
        const result = await ApiCreateItem({ position: _currentUser.position, archive: "tag" }, {
            name
        })
        if (result.success) {
            set_openTagModal(false)
            set_refresh(n => n + 1)
            store.dispatch(setModal({ type: "notification", open: true, msg: "タグの作成成功", value: "" }))
            setTimeout(() => {
                store.dispatch(setModal({ type: "", open: false, msg: "", value: "" }))
            }, 3000);
        } else {
            set_openTagModal(false)
            store.dispatch(setModal({ type: "notification", open: true, msg: "タグの作成失敗", value: "" }))
            setTimeout(() => {
                store.dispatch(setModal({ type: "n", open: false, msg: "", value: "" }))
            }, 3000);
        }
    }

    return (
        <div className='relative'>
            <div className={`${_openTagModal ? "fixed" : "hidden"} top-0 left-0 w-full h-full backdrop-brightness-90 backdrop-blur-sm z-1 flex flex-col justify-center'`}>
                <div className="bg-white w-11/12  m-auto flex px-2 gap-2">
                    <Input onchange={(v) => set_newTag(v)} value={_newTag} key={_openTagModal.toString()}></Input>
                    <div className='w-28 h-12 m-auto flex flex-col justify-center text-center bg-org-button text-white rounded-2xl cursor-pointer font-bold' onClick={() => createTag(_newTag)}>作成</div>
                    <div className='w-28 h-12 m-auto flex flex-col justify-center text-center border-2 border-org-button rounded-2xl cursor-pointer text-sm' onClick={() => { set_openTagModal(false); set_newTag("") }}>キャンセル</div>
                </div>
            </div>

            <FacilityModal open={_modalFacility} share={(body) => { set_workplaceName(body.name); set_workplaceId(body.id); set_modalFacility(false) }} current={{ id: _workplaceId }} close={() => set_modalFacility(false)} />
            <div className='mb-2'>
                <div className=''>タイトル <span className='text-red-500 text-sm'>必須</span></div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>アイキャッチ画像<span className='text-sm opacity-50 italic'>（最大アップロードサイズ 2 MB）</span></div>
                <div className='w-max flex justify-between mb-2'>
                    <UploadButton name={<div className='border rounded-3xl py-1 px-4 bg-white cursor-pointer'><UploadIcon /> ファイルをアップロード</div>} onClick={(e) => getFile(e)} />
                </div>
                {
                    _imagePreview ?
                        <div className='w-full max-w-(--xs) relative'>
                            <Image src={_imagePreview} width="500" height="500" className='w-full' alt='img' />
                            <ClearIcon className='!w-10 !h-10 p-1 cursor-pointer text-red-500 absolute bottom-1 right-1 bg-white rounded-md' onClick={() => {
                                set_imageId(4)
                                set_imagePreview("")
                            }} />
                        </div>
                        : null
                }
            </div>
            <div className='mb-2'>
                <div className=''>事業所 <span className='text-red-500 text-sm'>必須</span></div>
                <div className='border rounded-md  px-4 bg-white w-max mb-2 h-12 flex flex-col justify-center cursor-pointer' onClick={() => set_modalFacility(!_modalFacility)}> 施設を選択</div>
                <Input onchange={v => console.log(v)} value={_workplaceName} sx='!w-full !m-0' disable />
            </div>
            <div className='mb-2'>
                <div className=''>担当者名</div>
                <Input onchange={v => set_contractName(v)} value={_contractName} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>担当者連絡先（メールアドレス）</div>
                <Input onchange={v => set_contract(v)} value={_contract} sx='!w-full !m-0' />
                <p className='text-red-500 text-xs'>{_contractWarn}</p>
            </div>
            <div className='mb-2'>
                <div className=''>職種</div>
                <div className='col-span-1 bg-white h-12 border border-slate-300 rounded text-lg'>
                    <select onChange={(e) => set_worktype(e.target.value)} value={_worktype} className='pt-2 w-full flex flex-col justify-center h-full'>
                        <option className='h-12 flex flex-col justify-center' value={""}>{"---"}</option>
                        {worktypeList.map((item, index) =>
                            <option className='' key={index} value={item.name} >{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='text-sm px-2 opacity-50'>その他</div>
                <Input onchange={v => { set_worktype(v) }} value={_worktype} sx='!w-full !m-0' />
                <div className="h-2"></div>
            </div>
            <div className='mb-2'>
                <div className=''>タグ</div>
                <Input onchange={v => set_worktag(v)} value={_worktag.map(t => t.name).toString()} sx='!w-full !m-0' disable />
                <div className='flex gap-2 mt-2 flex-wrap'>
                    {_tag.map((tag, index) =>
                        <div className={`border rounded-3xl text-sm px-2 py-1 border-slate-300 cursor-pointer ${_worktag.map(t => t.id).includes(tag.id) ? "bg-org-button/25" : "bg-org-button/5"}`} key={index} onClick={() => set_worktag(crr => crr.map(t => t.id).includes(tag.id) ? crr.filter(cr => cr.id !== tag.id) : [...crr, tag])}>{tag.name}</div>
                    )}
                    <div className={`border rounded-3xl text-sm px-2 py-1 border-slate-300 cursor-pointer bg-org-button/5 font-bold`} onClick={() => set_openTagModal(true)}>+</div>
                </div>
            </div>
            <div className='mb-2'>
                <div className=''>雇用形態</div>
                <div className='col-span-1 bg-white h-12 border border-slate-300 rounded text-lg'>
                    <select onChange={(e) => set_workstatus(e.target.value)} value={_workstatus} className='pt-2 w-full flex flex-col justify-center h-full'>
                        <option className='h-12 flex flex-col justify-center' value={""}>{"---"}</option>
                        {workstatusList.map((item, index) =>
                            <option className='' key={index} value={item.name} >{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='text-sm px-2 opacity-50'>その他</div>
                <Input onchange={v => set_workstatus(v)} value={_workstatus} sx='!w-full !m-0' />
                <div className="h-2"></div>

            </div>
            <div className='mb-2'>
                <div className=''>資格の有無</div>
                <div className='col-span-1 bg-white h-12 border border-slate-300 rounded text-lg'>
                    <select onChange={(e) => set_lisense(e.target.value)} value={_lisense} className='pt-2 w-full flex flex-col justify-center h-full'>
                        <option className='h-12 flex flex-col justify-center' value={""}>{"---"}</option>
                        {licenseList.map((item, index) =>
                            <option className='' key={index} value={item.name} >{item.name}</option>
                        )}
                    </select>
                </div>
                <div className='text-sm px-2 opacity-50'>その他</div>
                <Input onchange={v => set_lisense(v)} value={_lisense} sx='!w-full !m-0' />
                <div className="h-2"></div>
            </div>
            <div className='mb-2'>
                <div className=''>通勤時間</div>
                <Input onchange={v => set_worktime(v)} value={_worktime} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>給与</div>
                <Input onchange={v => set_workSalary(v)} value={_workSalary} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>賞与</div>
                <Input onchange={v => set_bonus(v)} value={_bonus} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>福利福利厚生（自由にご記入ください）厚生</div>
                <textarea onChange={e => set_workbenefit(e.currentTarget.value)} value={_workbenefit} className='!w-full !m-0 border border-slate-300 rounded h-36 bg-white p-2' />
            </div>
            <div className='mb-2'>
                <div className=''>掲載日</div>
                <Input key={moment(_startDate).format("YYYY-MM-DD")} type='date' onchange={v => set_startDate(v)} value={moment(_startDate).format("YYYY-MM-DD")} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>求人の内容</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} tool={true} />
            </div>
            <div className='bg-white p-2 border border-slate-300 shadow rounded'>
                <div className='mb-2 flex h-12 gap-2 my-2'>
                    <div className='h-full flex flex-col justify-center'>状態 : </div>
                    <div className='col-span-1 bg-white h-12 border  rounded active:outline-0 border-slate-300 w-20'>
                        <select onChange={(e) => set_draft(e.target.value === "1" ? true : false)} value={_draft ? 1 : 0} className='pt-2 w-full flex flex-col justify-center h-full'>
                            {/* <option className='h-12 flex flex-col justify-center' value={""}>{"---"}</option> */}
                            {[{ name: "下書き", value: 1 }, { name: "公開", value: 0 }].map((item, index) =>
                                <option className='text-black' key={index} value={item.value} >{item.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button name="戻る" sx='!bg-white !text-org-button border-1 !m-0 !w-24 text-sm' onClick={() => { toPage.back() }} />
                    <Button name="プレビュー" sx='!bg-white !text-org-button border-1 !m-0 !w-24 text-sm' onClick={async () => { const newBody = body; newBody.slug = "_preview"; await updateItem(7, body); window.open(process.env.home_url + "/post/_preview?archivePlus=post_preview", "_blank") }} />
                    {item ?
                        <Button name={"保存"} sx='!bg-org-button !m-0' onClick={() => { updateItem(_id, body) }} /> :
                        <Button name="作成" sx='!bg-org-button !m-0' disable={!_name || !_workplaceId} onClick={() => { createItem(body) }} />}
                </div>
            </div>
        </div>
    )
}

type InterviewProps = {
    item?: {
        id: number,
        archive: string,
        name: string,
        slug: string,
        worktype: string,
        content: string,
        contenttitle: string,
        imageId: number,
        image: {
            name: string
        },
        workplaceId: number,
        workplace: {
            name: string
        },
        video: string
        draft: boolean
    },
    event: () => void
    archive?: string
}
export const DetailInterview = ({ item, event, archive }: InterviewProps) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }
    useEffect(() => {
        update()
    }, [])

    const [_id, set_id] = useState<number>(0)
    const [_archive, set_archive] = useState<string>("")
    const [_name, set_name] = useState<string>("")
    const [_slug, set_slug] = useState<string>("")
    const [_contenttitle, set_contenttitle] = useState<string>("")
    const [_content, set_content] = useState<string>("")
    const [_newContent, set_newContent] = useState<string>("")
    const [_worktype, set_worktype] = useState<string>("")
    const [_workplaceName, set_workplaceName] = useState<string>("")
    const [_workplaceId, set_workplaceId] = useState<number>(0)
    const [_video, set_video] = useState<string>("")
    const [_draft, set_draft] = useState<boolean>(false)

    const [_modalFacility, set_modalFacility] = useState<boolean>(false)
    const [_imagePreview, set_imagePreview] = useState<string>("")
    const [_imageId, set_imageId] = useState<number>(0)

    useEffect(() => {
        if (item) {
            set_id(item.id)
            set_archive(item.archive)
            set_name(item.name)
            set_slug(item.slug)
            set_worktype(item.worktype)
            set_content(item.content)
            set_imageId(item.imageId)
            set_imagePreview(process.env.ftp_url + item.image.name)
            set_workplaceId(item.workplaceId)
            set_workplaceName(item.workplace.name)
            set_video(item.video)
            set_contenttitle(item.contenttitle)
            set_draft(item.draft)
        } else {
            set_slug("interview_" + moment(new Date).format("YYYY_MM_DD_hh_mm_ss"))
        }
    }, [item])

    const body = {
        name: _name,
        slug: _slug,
        content: _newContent || _content,
        worktype: _worktype,
        imageId: _imageId || 4,
        facilityId: _workplaceId,
        video: _video,
        contenttitle: _contenttitle,
        draft: _draft
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = async (id: number, body: any) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: _archive, id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "更新成功！", type: "notification" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
            }, 3000);
            if (id != 3 && event) {
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
    const createItem = async (body: unknown) => {
        const result = await ApiCreateItem({ position: _currentUser.position, archive: archive }, body)
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

    const toPage = useRouter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFile = async (e: any) => {
        const files = e.target.files;
        const file: File | undefined = files ? files[0] : undefined
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = async function () {
                const result = await ApiUploadFile({ position: _currentUser.position, archive: "file", file })
                if (result.success) {
                    set_imageId(result.data.id)
                    set_imagePreview(process.env.ftp_url + result.data.name)
                    if (event) {
                        event()
                    }
                }
            }
        }

    }
    const [_isHover1, set_isHover1] = useState<boolean>(false)
    return (
        <div>
            <FacilityModal open={_modalFacility} share={(body) => { set_workplaceName(body.name); set_workplaceId(body.id); set_modalFacility(false) }} current={{ id: _workplaceId }} close={() => set_modalFacility(false)} />
            <div className='mb-2'>
                <div className=''>タイトル <span className='text-red-500 text-sm'>必須</span></div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>アイキャッチ画像<span className='text-sm opacity-50 italic'>（最大アップロードサイズ 2 MB）</span></div>
                <div className='w-max flex justify-between'>
                    <UploadButton name={<div className='border rounded-3xl py-1 px-4 bg-white'><UploadIcon /> ファイルをアップロード</div>} onClick={(e) => getFile(e)} />
                </div>
                {
                    _imagePreview ?
                        <div className='w-full max-w-(--xs)'>
                            <ClearIcon className='!w-12 !h-12 p-2 cursor-pointer text-red-500 !block ml-auto mr-0' onClick={() => {
                                set_imageId(4)
                                set_imagePreview("")
                            }} />
                            <Image src={_imagePreview} width="200" height="200" className='w-full' alt='img' />

                        </div>
                        : null
                }
            </div>
            <div className='mb-2'>
                <div className=''>事業所 <span className='text-red-500 text-sm'>必須</span></div>
                <div className='border rounded-md  px-4 bg-white w-max mb-2 h-12 flex flex-col justify-center cursor-pointer' onClick={() => set_modalFacility(!_modalFacility)}> 施設を選択</div>
                <Input onchange={v => console.log(v)} value={_workplaceName} sx='!w-full !m-0' disable />
            </div>
            <div className='mb-2'>
                <div className=''>職種</div>
                <Input onchange={v => set_worktype(v)} value={_worktype} sx='!w-full !m-0' />
            </div>
            <div className='mb-2 relative w-full' onMouseLeave={() => set_isHover1(false)}>
                <div>紹介動画 YouTube URL <span className='text-sm opacity-50 hover:underline cursor-pointer' onMouseEnter={() => set_isHover1(true)}>埋め込みかた</span>
                    <div className={`absolute top-[50%] left-[5%] h-(--xs) w-11/12 max-w-(--xs) bg-white z-1 ${_isHover1 ? "block" : "hidden"} shadow border-2 border-org-button rounded-md`} onMouseLeave={() => set_isHover1(false)}>
                        <Image src={"/gif/sample.gif"} fill className='object-cover' alt='gif' />
                    </div>
                </div>
                <Input onchange={v => set_video(v)} value={_video} sx='!w-full !m-0 relative z-0' />
            </div>
            <div className='mb-2'>
                <div className=''>自由記入欄 （インタビュー対象者の挨拶）</div>
                <Input onchange={v => set_contenttitle(v)} value={_contenttitle} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>インタビューの内容</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>
            <div className='bg-white p-2 border border-slate-300 shadow rounded'>
                <div className='mb-2 flex h-12 gap-2 my-2'>
                    <div className='h-full flex flex-col justify-center'>状態 : </div>
                    <div className='col-span-1 bg-white h-12 border  rounded active:outline-0 border-slate-300 w-20'>
                        <select onChange={(e) => set_draft(e.target.value === "1" ? true : false)} value={_draft ? 1 : 0} className='pt-2 w-full flex flex-col justify-center h-full'>
                            {/* <option className='h-12 flex flex-col justify-center' value={""}>{"---"}</option> */}
                            {[{ name: "下書き", value: 1 }, { name: "公開", value: 0 }].map((item, index) =>
                                <option className='text-black' key={index} value={item.value} >{item.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button name="戻る" sx='!bg-white !text-org-button border-1 !m-0 !w-20' onClick={() => { toPage.back() }} />
                    <Button name="プレビュー" sx='!bg-white !text-org-button border-1 !m-0 !w-24 text-sm' onClick={async () => { const newBody = body; newBody.slug = "_preview"; await updateItem(3, body); window.open(process.env.home_url + "/interview/_preview?archivePlus=interview_preview", "_blank") }} />

                    {item ?
                        <Button name={"保存"} sx='!bg-org-button !m-0' onClick={() => { updateItem(_id, body) }} /> :
                        <Button name="作成" sx='!bg-org-button !m-0' disable={!_name || !_workplaceId} onClick={() => { createItem(body) }} />}
                </div>
            </div>

        </div>
    )
}