import { setModal } from '@/redux/reducer/ModalReduce';
import store from '@/redux/store';
import React, { useEffect, useState } from 'react'
type Props = {
  type: string;
  msg: string,
  open: boolean
}
const NotificationModal = ({ type, msg, open }: Props) => {

  const [_translate, set_translate] = useState<boolean>(false)
  useEffect(() => {
    setTimeout(() => {
      set_translate(open)
    }, 100);
  }, [open])

  switch (type) {
    case "notification":
      return (
        <div className={`absolute top-4 right-4 bg-sky-900 text-white text-sm py-1 px-4 rounded-3xl transition-all duration-300 shadow-xl ${_translate ? "translate-x-[0%]" : "translate-x-[200%]"} `}>
          {msg}
        </div>
      )
    case "confirm":
      return (
        <div className={`fixed top-0 left-0 backdrop-brightness-75 text-sm py-1 px-4  w-screen h-screen flex flex-col justify-center ${_translate ? "scale-100" : "scale-0"} `}>
          <div className=' w-max m-auto gap-4 bg-white rounded-xl p-8'>

            <div className={` flex flex-col justify-center text-center text-base text-sky-900 font-bold  `}>
              {msg}
            </div>
            <div className="h-4">
            </div>
            <div className="flex justify-center gap-2">
              <div className='text-base flex flex-col justify-center w-20 h-10 cursor-pointer rounded-md bg-sky-600 text-white text-center' onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "yes" }))}>はい</div>
              <div className='text-base flex flex-col justify-center w-20 h-10 cursor-pointer rounded-md border text-sky-600 text-center' onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "no" }))}>いいえ</div>
            </div>
            {/* <CheckIcon className={` cursor-pointer `} onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "yes" }))} /> */}
            {/* <ClearIcon className={` cursor-pointer`} onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "no" }))} /> */}
          </div>
        </div>
      )

    default: return null
  }
}

export default NotificationModal