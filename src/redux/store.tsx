import { configureStore } from "@reduxjs/toolkit";

import MenuReducer from "./reducer/MenuReduce";
import RefreshReducer from "./reducer/RefreshReduce";
import UserReducer from "./reducer/UserReduce";
import ModalReducer from "./reducer/ModalReduce";
import AlertReducer from "./reducer/alertReducer";
import NoticeReducer from "./reducer/noticeReducer";

const store = configureStore({
    reducer: {
        menu: MenuReducer.reducer,
        refresh: RefreshReducer.reducer,
        user: UserReducer.reducer,
        modal: ModalReducer.reducer,
        alert: AlertReducer.reducer,
        notice: NoticeReducer.reducer,

    }
})

export default store