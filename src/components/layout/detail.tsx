'use client'
import { UserType } from '@/redux/reducer/UserReduce'
import React, { useEffect, useState } from 'react'
import { Input } from '../input/input'
import { Button, UploadButton } from '../button/button'
import { ApiCreateItem, ApiUpdateItem, ApiUploadFile } from '@/api/user'
import store from '@/redux/store'
import { setRefresh } from '@/redux/reducer/RefreshReduce'
import TextArea from '../input/textarea'
import { DividerSelect } from '../input/divider'
import { ApiItem, getAddress } from '@/api/client'
import { japanRegions } from '@/lib/area'
import ImageIcon from '@mui/icons-material/Image';
import PicModal from '../modal/picModal'
import Image from 'next/image'
import FacilityModal from '../modal/faciclityModal'
import ApartmentIcon from '@mui/icons-material/Apartment';
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { setModal } from '@/redux/reducer/ModalReduce'
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
    const body = {
        username: _username || user.username,
        email: _email || user.email,
        password: _password || undefined,
        facilitieslimit: Number(_facilityLimit) || user.facilitieslimit,
        active: true
    }
    const updateUser = async (body: {
        password?: string;
        facilitieslimit: number;
    }) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: "user", id: user.id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, msg: "更新成功！", value: "", type: "notificaiton" }))
            setTimeout(() => {
                store.dispatch(setModal({ open: false, msg: "", value: "", type: "" }))
            }, 3000);
            store.dispatch(setRefresh())

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
    }, [user])


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
                <Button name="CREATE" sx='!bg-org-button' disable={!_username || !_email || !_password} onClick={() => { create(body) }} />
            </div>
            :
            <div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-28'>ユーザー</div>
                    <div className='flex flex-col justify-center w-72 border border-slate-200 px-2'>{user.username}</div>
                </div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-28'>メール</div>
                    <div className='flex flex-col justify-center w-72 border border-slate-200 px-2'>{user.email}</div>
                </div>
                <div className="h-3"></div>
                <div className='flex gap-2 mb-2'>
                    <div className='h-9 flex flex-col justify-center w-44'>新しいパスワード</div>
                    <Input type='password' onchange={v => set_password(v)} value={_password} sx='!w-72 !m-0' />
                </div>
                {_currentUser.position === "admin" ?
                    <div className='flex gap-2 mb-2'>
                        <div className='h-9 flex flex-col justify-center w-44'>施設制限数</div>
                        <Input key={_facilityLimit} type='number' onchange={v => set_facilityLimit(v)} value={_facilityLimit?.toString()} sx='!w-72 !m-0' />
                    </div> :
                    null}
                <Button name="SAVE" sx='!bg-org-button' disable={!_password && !_facilityLimit} onClick={() => { updateUser(body) }} />
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
    const [_categoryName, set_categoryName] = useState<string>("")

    useEffect(() => {
        if (item) {
            set_id(item.id)
            set_archive(item.archive)
            set_name(item.name)
            set_slug(item.slug)
            set_content(item.content)
            set_categoryId(item.categoryId)
            set_categoryName(item.category.name)
        } else {
            set_slug("new_" + moment(new Date).format("YYYY_MM_DD_hh_mm_ss"))
        }
    }, [item])

    const body = {
        name: _name,
        slug: _slug,
        content: _newContent || _content,
        categoryId: _categoryId,

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

    const [_category, set_category] = useState<{ id: number, name: string, }[]>([])

    const getCategory = async () => {
        const result = await ApiItem({ archive: "category" })
        console.log(result)
        if (result.success) {
            set_category(result.data)
        } else {
            set_category([])
        }
    }
    useEffect(() => {
        getCategory()
    }, [])

    const toPage = useRouter()

    return (
        <div>
            <button className='block mx-auto mb-4 w-max bg-org-button text-white px-2 rounded shadow-md cursor-pointer' onClick={() => { toPage.push("/" + archive + "/news") }}>新規ニュース</button>
            <div className='mb-2'>
                <div className='font-bold text-sm'>タイトル</div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className='font-bold text-sm'>カテゴリー</div>
                <DividerSelect name={_categoryName} data={[{ name: "---", id: 0 }, ..._category]} valueReturn={(pair) => set_categoryId(pair.id)} sx='border border-slate-300 ' />
            </div>
            <div className='mb-2'>
                <div className='font-bold text-sm'>コンテンツ</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>
            <div className='mb-2'>
                <div className='text-sm'>施設URLを変更できます（英数字でご記入ください）</div>
                <Input onchange={v => set_slug(v)} value={_slug} sx='!w-full !m-0' />
            </div>
            <div className="flex gap-1">
                <Button name="戻る" sx='!bg-white !text-org-button border-2 !m-0' onClick={() => { toPage.back() }} />
                {item ? <Button name="更新" sx='!bg-org-button !m-0' onClick={() => { updateItem(body) }} /> : <Button name="作成" sx='!bg-org-button !m-0' onClick={() => { createItem(body) }} />}
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

    const [_modalImage, set_modalImage] = useState<boolean>(false)
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

        } else {
            set_slug("facility_" + moment(new Date()).format("YYYY_MM_DD_hh_mm_ss"))
        }
    }, [item])

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
        video: _video
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
            <button className='block mx-auto mb-4 w-max bg-org-button text-white px-2 rounded shadow-md cursor-pointer' onClick={() => { toPage.push("/facility/news") }}>新規施設登録</button>

            <PicModal open={_modalImage} share={(body) => { set_imagePreview(process.env.ftp_url + body.name); set_imageId(body.id); set_modalImage(false) }} />
            <div className='mb-2'>
                <div className=' '>施設名 <span className='text-sm text-red-500'>必須</span></div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=' '>キャッチコピー（自由にご記入ください）</div>
                <Input onchange={v => set_contenttitle(v)} value={_contenttitle} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=' '>アイキャッチ画像</div>
                <ImageIcon className='!w-12 !h-12 p-2 cursor-pointer' onClick={() => set_modalImage(!_modalImage)} />
                {
                    _imagePreview ?
                        <Image src={_imagePreview} width="200" height="200" alt='img' />
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
                <div className=''>施設URLを変更できます（英数字でご記入ください）</div>
                <Input onchange={v => set_slug(v)} value={_slug} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''></div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>
            <div className="flex gap-1">
                <Button name="戻る" sx='!bg-white !text-org-button border-2 !m-0' onClick={() => { toPage.back() }} />
                {item ?
                    <Button name="更新" sx='!bg-org-button !m-0' onClick={() => { updateItem(body) }} /> :
                    <Button name="作成" sx='!bg-org-button !m-0' disable={!_name || !_postno || !_phone || !_address} onClick={() => { createItem(body) }} />}
            </div>


        </div>
    )
}
type PostProps = {
    item?: {
        id: number,
        archive: string,
        name: string,
        slug: string,
        worktype: string,
        tag: string,
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
    const [_worktag, set_worktag] = useState<string>("")
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

    // const [_modalImage, set_modalImage] = useState<boolean>(false)
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
            set_worktag(item.tag)
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
        tag: _worktag,
        workstatus: _workstatus,
        worktime: _worktime,
        worksalary: _workSalary,
        bonus: _bonus,
        workbenefit: _workbenefit,
        imageId: _imageId || 2,
        facilityId: _workplaceId,
        lisense: _lisense,
        dayoff: _dayoff,
        startDate: new Date(_startDate),
        endDate: new Date(_endDate)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = async (body: any) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: _archive, id: _id }, body)
        if (result.success) {
            store.dispatch(setModal({ open: true, value: "", msg: "更新功！", type: "notification" }))
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
    return (
        <div>
            <button className='block mx-auto mb-4 w-max bg-org-button text-white px-2 rounded shadow-md cursor-pointer' onClick={() => { toPage.push("/" + archive + "/news") }}>新規求人情報登録</button>

            <FacilityModal open={_modalFacility} share={(body) => { set_workplaceName(body.name); set_workplaceId(body.id); set_modalFacility(false) }} current={{ id: _workplaceId }} />
            <div className='mb-2'>
                <div className=''>タイトル <span className='text-red-500 text-sm'>必須</span></div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>アイキャッチ画像</div>
                <UploadButton name={<ImageIcon className='!w-12 !h-12 p-2 cursor-pointer' />} onClick={(e) => getFile(e)} />
                {
                    _imagePreview ?
                        <Image src={_imagePreview} width="200" height="200" alt='img' />
                        : null
                }
            </div>
            <div className='mb-2'>
                <div className=''>事業所 <span className='text-red-500 text-sm'>必須</span></div>
                <ApartmentIcon className='!w-12 !h-12 p-2 cursor-pointer' onClick={() => set_modalFacility(!_modalFacility)} />
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
                <Input onchange={v => set_worktype(v)} value={_worktype} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>タッグ</div>
                <Input onchange={v => set_worktag(v)} value={_worktag} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>雇用形態</div>
                <Input onchange={v => set_workstatus(v)} value={_workstatus} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>資格の有無</div>
                <Input onchange={v => set_lisense(v)} value={_lisense} sx='!w-full !m-0' />
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
                <textarea onChange={e => set_workbenefit(e.currentTarget.value)} value={_workbenefit} className='!w-full !m-0 border border-slate-300 rounded h-36' />
            </div>
            <div className='mb-2'>
                <div className=''>掲載日</div>
                <Input type='date' onchange={v => set_startDate(v)} value={moment(_startDate).format("YYYY/MM/DD")} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>掲載終了日</div>
                <Input type='date' onchange={v => set_endDate(v)} value={moment(_endDate).format("YYYY/MM/DD")} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>求人URLを変更できます（英数字でご記入ください）</div>
                <Input onchange={v => set_slug(v)} value={_slug} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>自由記入欄 （求人の内容や、施設の紹介をご記入ください）</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>
            <div className="flex gap-1">
                <Button name="戻る" sx='!bg-white !text-org-button border-2 !m-0' onClick={() => { toPage.back() }} />
                {item ?
                    <Button name="更新" sx='!bg-org-button !m-0' onClick={() => { updateItem(body) }} /> :
                    <Button name="作成" sx='!bg-org-button !m-0' disable={!_name || !_workplaceId} onClick={() => { createItem(body) }} />}
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
        } else {
            set_slug("post_" + moment(new Date).format("YYYY_MM_DD_hh_mm_ss"))
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
        contenttitle: _contenttitle
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = async (body: any) => {
        const result = await ApiUpdateItem({ position: _currentUser.position, archive: _archive, id: _id }, body)
        if (result.success) {
            if (event) {
                event()
            }
        } else {
            console.log(result.data)
        }
    }
    const createItem = async (body: unknown) => {
        const result = await ApiCreateItem({ position: _currentUser.position, archive: archive }, body)
        if (result.success) {
            if (event) {
                event()
            }
        } else {
            console.log(result.data)
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
    return (
        <div>
            <button className='block mx-auto mb-4 w-max bg-org-button text-white px-2 rounded shadow-md cursor-pointer' onClick={() => { toPage.push("/" + archive + "/news") }}>新規求人情報登録</button>

            <FacilityModal open={_modalFacility} share={(body) => { set_workplaceName(body.name); set_workplaceId(body.id); set_modalFacility(false) }} current={{ id: _workplaceId }} />
            <div className='mb-2'>
                <div className=''>タイトル <span className='text-red-500 text-sm'>必須</span></div>
                <Input onchange={v => set_name(v)} value={_name} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>アイキャッチ画像</div>
                <UploadButton name={<ImageIcon className='!w-12 !h-12 p-2 cursor-pointer' />} onClick={(e) => getFile(e)} />
                {
                    _imagePreview ?
                        <Image src={_imagePreview} width="200" height="200" alt='img' />
                        : null
                }
            </div>
            <div className='mb-2'>
                <div className=''>事業所 <span className='text-red-500 text-sm'>必須</span></div>
                <ApartmentIcon className='!w-12 !h-12 p-2 cursor-pointer' onClick={() => set_modalFacility(!_modalFacility)} />
                <Input onchange={v => console.log(v)} value={_workplaceName} sx='!w-full !m-0' disable />
            </div>
            <div className='mb-2'>
                <div className=''>職種</div>
                <Input onchange={v => set_worktype(v)} value={_worktype} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>紹介動画 YouTube URL</div>
                <Input onchange={v => set_video(v)} value={_video} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>求人URLを変更できます（英数字でご記入ください）</div>
                <Input onchange={v => set_slug(v)} value={_slug} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>自由記入欄 （インタビュー対象者の挨拶）</div>
                <Input onchange={v => set_contenttitle(v)} value={_contenttitle} sx='!w-full !m-0' />
            </div>
            <div className='mb-2'>
                <div className=''>自由記入欄 （求人の内容や、インタビューの紹介をご記入ください）</div>
                <TextArea onchange={(value: React.SetStateAction<string>) => set_newContent(value)} value={_content} />
            </div>
            <div className="flex gap-1">
                <Button name="戻る" sx='!bg-white !text-org-button border-2 !m-0' onClick={() => { toPage.back() }} />
                {item ?
                    <Button name="更新" sx='!bg-org-button !m-0' onClick={() => { updateItem(body) }} /> :
                    <Button name="作成" sx='!bg-org-button !m-0' disable={!_name || !_workplaceId} onClick={() => { createItem(body) }} />}
            </div>

        </div>
    )
}