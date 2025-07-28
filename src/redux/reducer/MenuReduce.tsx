
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

const MenuReducer = createSlice({
    name: "Menu",
    initialState: false,
    reducers: {
        setMenu: {
            reducer: (state: boolean, action: PayloadAction<boolean>) => {
                return (state = action.payload)
            },
            prepare: (msg: boolean) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = MenuReducer
export const { setMenu } = actions;

export default MenuReducer