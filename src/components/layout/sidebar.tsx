'use client'
import React, { useEffect, useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import ArticleIcon from '@mui/icons-material/Article';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import CategoryIcon from '@mui/icons-material/Category';
import ApartmentIcon from '@mui/icons-material/Apartment';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import LogoutIcon from '@mui/icons-material/Logout';
import { ApiLogout } from '@/api/user';
import store from '@/redux/store';
import { setRefresh } from '@/redux/reducer/RefreshReduce';
import { UserType } from '@/redux/reducer/UserReduce';
import HomeIcon from '@mui/icons-material/Home';
import { ModalType, setModal } from '@/redux/reducer/ModalReduce';
import Link from 'next/link';
const Sidebar = () => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
        store.subscribe(() => set_currentModal(store.getState().modal))
    }
    useEffect(() => {
        update()
    }, [])

    const [_isLogOut, set_isLogOut] = useState<boolean>(false)
    const menu = [{
        icon: <DashboardIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "ダッシュボード",
        link: "/"
    },
    {
        icon: <ArticleIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "ニュース",
        link: "/news",
        limit: "user"
    },
    {
        icon: <ArticleIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "求人情報",
        link: "/post",
    },

    {
        icon: <ApartmentIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "施設情報",
        link: "/facility"
    },
    {
        icon: <InterpreterModeIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "インタビュー",
        link: "/interview",
        limit: "user"
    },
    {
        icon: <InsertPhotoIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "写真",
        link: "/file",
        limit: "user"
    },
    {
        icon: <PersonIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "ユーザー",
        link: _currentUser.position === "admin" ? "/user" : "/user/" + _currentUser.id
    },
    {
        icon: <CategoryIcon className='h-7 w-7 my-auto text-org-button' />,
        name: "カテゴリー",
        link: "/category",
        limit: "user"
    },
    ]
    const toPage = useRouter()
    useEffect(() => {
        const logout = async () => {
            const result = await ApiLogout({ position: _currentUser.position })
            if (result) {
                store.dispatch(setRefresh())
            }
        }
        if (_isLogOut && _currentModal.value === "yes") {
            logout()
        }
    }, [_isLogOut, _currentModal.value, _currentUser.position])
    return (
        <div className='w-max'>
            <div className="h-6"></div>
            <div className="h-12 flex flex-col justify-center font-bold bg-white text-center shadow-md rounded-md text-org-button">{_currentUser.position === "admin" ? "管理者モード" : ""}</div>
            <div className="h-6"></div>
            <div className=''>
                {
                    menu.map((m, index) =>
                        m.limit === _currentUser.position ? null : <div key={index} className='flex gap-2 h-8 cursor-pointer hover:opacity-75' onClick={() => toPage.push(m.link)}>
                            {m.icon}
                            <p className='h-full flex flex-col justify-center  text-sm'>{m.name}</p>
                        </div>
                    )
                }
            </div>
            <div className="h-8"></div>
            {
                process.env.home_url ?
                    <Link href={process.env.home_url} target='_blank'>
                        <div className='flex gap-2 h-8 cursor-pointer hover:opacity-75'>
                            <HomeIcon className='h-7 w-7 my-auto text-org-button' />
                            <p className='h-full flex flex-col justify-center  text-sm'>就職サイト</p>
                        </div>
                    </Link> :
                    null
            }
            <div className="h-8"></div>
            <div className='flex gap-2 h-8 cursor-pointer hover:opacity-75' onClick={() => { set_isLogOut(true); store.dispatch(setModal({ type: "confirm", open: true, value: "", msg: "ログアウトしてもよろしいですか?" })) }}>
                <LogoutIcon className='h-7 w-7 my-auto text-org-button' />
                <p className='h-full flex flex-col justify-center  text-sm'>ログアウト</p>
            </div>
        </div>
    )
}

export default Sidebar