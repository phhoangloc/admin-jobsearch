/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'

type Props = {
    onchange: (v: any) => void,
    value: string,
    sx?: string,
    type?: string,
    icon?: React.ReactNode,
    disable?: boolean
}

export const Input = ({ onchange, value, sx, type, icon, disable }: Props) => {

    const [_value, set_value] = useState<string>("")
    const [_focus, set_focus] = useState<boolean>(false)
    useEffect(() => {
        if (_value) {
            onchange(_value)
        }
    }, [_value, onchange])

    const _sx = `block w-full px-2 my-2 mx-auto h-12 border transition-all duration-200 bg-white rounded ${_focus ? "shadow border-sky-600" : "border-slate-300"}  disabled:opacity-50 `
    return (
        <div className={`relative w-full`}>
            <input className={_sx + " " + sx}
                type={type}
                onChange={(e) => { set_value(e.currentTarget.value) }}
                onFocus={(e) => { e.currentTarget.style.outline = "none"; set_focus(true) }}
                onBlur={() => set_focus(false)}
                defaultValue={value}
                disabled={disable}
            ></input>
            {icon ? <div className='absolute w-max p-2 h-full top-0 right-0 flex flex-col justify-center text-center'>{icon}</div> : null}
        </div>
    )
}