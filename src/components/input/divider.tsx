
import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export type DividerType = {
    id?: number
    name: string,
    func?: () => void
}
type Props = {
    name: React.ReactNode,
    onClick?: () => void,
    data?: DividerType[],
    sx?: string,
    valueReturn?: ({ id, name }: { id: number, name: string }) => void

}
export const Divider = ({ name, onClick, sx }: Props) => {
    return (
        <div className={`h-12 flex flex-col justify-center cursor-pointer py-1 px-2 border-b border-slate-300 ${sx ? sx : ""}`} onClick={() => onClick && onClick()}>{name}</div>
    )
}

export const DividerSelect = ({ data, name, sx, valueReturn }: Props) => {
    const [drop, setDrop] = useState<boolean>(false)
    const [_name, set_name] = useState<string>("")
    const [_id, set_id] = useState<number>(-1)

    useEffect(() => {
        if (valueReturn && _id !== -1) {
            valueReturn({ id: _id, name: _name })
        }
    }, [_id, _name, valueReturn])
    return (
        <div className={`relative h-12  ${sx}`}>
            <Divider name={
                <div className='flex justify-between'>
                    <div className='flex flex-col justify-center'>{valueReturn && _name || name}</div>
                    <KeyboardArrowDownIcon className='!w-9 !h-9 p-1' />
                </div>
            }
                onClick={() => { setDrop(!drop) }} />
            <div className={` absolute z-10 top-13 w-full h-full overflow-hidden ${drop ? "shadow border border-slate-300" : "shadow-none border-none"}  rounded bg-slate-50 shadow`} style={{ height: drop && data?.length ? (data.length) * 3 + "rem" : 0 }} >
                {data?.length && drop ? data.map((d: DividerType, index: number) =>
                    <Divider sx='hover:bg-slate-100' key={index} name={d.name} onClick={() => { set_name(d.name); set_id(index); setDrop(!drop); if (d.func) { d.func() } }} />
                ) : null}
            </div >
        </div>
    )
}