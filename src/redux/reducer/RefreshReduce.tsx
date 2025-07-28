
import { createSlice } from "@reduxjs/toolkit"


const RefreshReducer = createSlice({
    name: "Refresh",
    initialState: 0,
    reducers: {
        setRefresh: (state) => {
            return (state = state + 1)
        },

    }
})
export const { actions, reducer } = RefreshReducer
export const { setRefresh } = actions;

export default RefreshReducer