'use client'
import React, { useState, useEffect } from 'react'
import store from '../store'
import { ApiCheckLogin } from '@/api/user'
import { setUser, UserType } from '../reducer/UserReduce'
import LoginCard from '@/components/card/loginCard'
import Modal from '@/components/modal/modal'
type Props = {
    children: React.ReactNode
}

const Provider = ({ children }: Props) => {

    const [currentRefresh, setCurrentRefresh] = useState<number>(store.getState().refresh)
    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)
    const update = () => {
        store.subscribe(() => setCurrentRefresh(store.getState().refresh))
        store.subscribe(() => set_currentUser(store.getState().user))

    }
    useEffect(() => {
        update()
    })

    const [_loading, set_loading] = useState<boolean>(true)

    const isLogin = async () => {
        set_loading(true)
        try {
            const result = await ApiCheckLogin()
            if (result.success) {
                set_loading(false)
                store.dispatch(setUser(result.data))
            } else {
                set_loading(false)
                store.dispatch(setUser({} as UserType))
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            set_loading(false)
            store.dispatch(setUser({} as UserType))
        }

    }


    useEffect(() => {
        isLogin()
    }, [currentRefresh])
    return (
        _loading ?
            <div>loading...</div> :
            _currentUser.id ? children :
                <div className="flex flex-col justify-center min-h-screen">
                    <Modal />
                    <LoginCard />
                    <p className='text-center opacity-75'>手話を活かして働く 手話で繋がるポータルサイト に統一</p>
                </div>
    )
}

export default Provider
