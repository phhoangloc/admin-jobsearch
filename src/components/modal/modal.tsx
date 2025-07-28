'use client'
import { ModalType } from '@/redux/reducer/ModalReduce'
import store from '@/redux/store'
import React, { useState, useEffect } from 'react'
import NotificationModal from './notification'

const Modal = () => {

    const [_currentModal, set_currentModal] = useState<ModalType>(store.getState().modal)
    const update = () => {
        store.subscribe(() => set_currentModal(store.getState().modal))
    }
    useEffect(() => {
        update()
    }, [])
    return (
        <div className={`w-screen h-screen z-1 ${_currentModal.open ? "fixed" : "hidden"}`}>
            {
                _currentModal.type === "notification" ? <NotificationModal {..._currentModal} /> : null
            }
            {
                _currentModal.type === "confirm" ? <NotificationModal {..._currentModal} /> : null
            }
        </div>
    )
}

export default Modal