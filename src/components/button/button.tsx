"use client"
import React, { useRef } from 'react'
type Props = {
    onClick: (e: unknown) => void,
    name: React.ReactNode,
    disable?: boolean,
    sx?: string,
}

export const Button = ({ onClick, name, disable, sx }: Props) => {
    return (
        <button
            className={`h-12 w-48 rounded bg-sky-600 mx-auto my-12 text-white cursor-pointer disabled:opacity-25 disabled:cursor-default } ${sx} `}
            disabled={disable ? disable : false}
            onClick={(e) => onClick(e)}>
            {name}
        </button>
    )
}

export const UploadButton = ({ name, onClick, sx }: Props) => {
    const IconRef = useRef<HTMLInputElement | null>(null)
    return (
        <div className={`${sx} `}>
            <input ref={IconRef} type="file" style={{ display: "none" }} onChange={(e) => onClick && onClick(e)} multiple={true} />
            <div onClick={() => IconRef.current && IconRef.current.click()}>{name}</div>
        </div>
    )
}

