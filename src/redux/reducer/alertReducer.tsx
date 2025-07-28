
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"
export type AlertType = {
    value: boolean,
    open: boolean,
    msg: string
}
const AlertReducer = createSlice({
    name: "Alert",
    initialState: { value: false, open: false, msg: "" },
    reducers: {
        setAlert: {
            reducer: (state: AlertType, action: PayloadAction<AlertType>) => {
                return (state = action.payload)
            },
            prepare: (msg: AlertType) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = AlertReducer
export const { setAlert } = actions;

export default AlertReducer