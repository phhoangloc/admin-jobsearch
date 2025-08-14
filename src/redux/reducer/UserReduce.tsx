
import { createSlice } from "@reduxjs/toolkit"
import { PayloadAction } from "@reduxjs/toolkit"

export type UserType = {
    id: number,
    username: string,
    email: string,
    position: string,
    active: boolean,
    facilitieslimit: number
    editfacilities: {
        facilityId: number
    }[]
}
const UserReducer = createSlice({
    name: "User",
    initialState: {} as UserType,
    reducers: {
        setUser: {
            reducer: (state, action: PayloadAction<UserType>) => {
                return (state = action.payload)
            },
            prepare: (msg: UserType) => {
                return {
                    payload: msg
                }
            }
        }
    }
})

export const { actions, reducer } = UserReducer
export const { setUser } = actions;

export default UserReducer