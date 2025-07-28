import React from 'react'

type Props = {
    page: number,
    next: () => void,
    prev: () => void,
    select: (x: number) => void,
    end?: boolean
}

const Pagination = ({ page, next, prev, end, select }: Props) => {

    return (
        <div className='w-max flex mx-auto  '>
            {page == 1 ?
                <div className='w-12 h-12 flex flex-col justify-center text-center' /> :
                <div className='w-12 h-12 flex flex-col justify-center text-center cursor-pointer opacity-50 hover:opacity-100 hover:text-lv-11' onClick={() => prev()}>
                    {`<<`}
                </div>}
            {Array.from({ length: page - 1 }, (_, i) => i + 1).slice(-2).map((number, index) =>
                <div key={index} className='w-12 h-12 flex flex-col justify-center text-center cursor-pointer' onClick={() => select(number)}>
                    {number}
                </div>)}
            <div className='w-12 h-12 flex flex-col justify-center text-center font-bold'>
                {page}
            </div>
            {end ?
                <div className='w-12 h-12 flex flex-col justify-center text-center' /> :
                <div className='w-12 h-12 flex flex-col justify-center text-center cursor-pointer opacity-50 hover:opacity-100 hover:text-lv-11' onClick={() => next()}>
                    {`>>`}

                </div>
            }
        </div>
    )
}

export default Pagination