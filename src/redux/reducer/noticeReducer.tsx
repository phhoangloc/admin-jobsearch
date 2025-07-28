
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"
export type NoticeType = {
    success: boolean,
    open: boolean,
    msg: string
}
const NoticeReducer = createSlice({
    name: "Notice",
    initialState: { success: false, open: false, msg: "" },
    reducers: {
        setNotice: {
            reducer: (state: NoticeType, action: PayloadAction<NoticeType>) => {
                return (state = action.payload)
            },
            prepare: (msg: NoticeType) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = NoticeReducer
export const { setNotice } = actions;

export default NoticeReducer