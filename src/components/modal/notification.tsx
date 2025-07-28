import { setModal } from '@/redux/reducer/ModalReduce';
import store from '@/redux/store';
import React, { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
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
        <div className={`absolute bottom-4 right-4 bg-sky-900 text-white text-sm py-1 px-4 rounded-3xl transition-all duration-300 ${_translate ? "translate-x-[0%]" : "translate-x-[200%]"} `}>
          {msg}
        </div>
      )
    case "confirm":
      return (
        <div className={`absolute bottom-4 right-4 bg-sky-900 text-white text-sm py-1 px-4 rounded-3xl transition-all duration-300 ${_translate ? "translate-x-[0%]" : "translate-x-[200%]"} `}>
          <div className='flex w-max m-auto gap-4 h-full'>

            <div className={`h-full flex flex-col justify-center text-center text-base  `}>
              {msg}
            </div>
            <CheckIcon className={` cursor-pointer `} onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "yes" }))} />
            <ClearIcon className={` cursor-pointer`} onClick={() => store.dispatch(setModal({ open: false, msg: "", type: "", value: "no" }))} />
          </div>
        </div>
      )

    default: return null
  }
}

export default NotificationModal