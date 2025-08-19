/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { ApiItemUser } from "@/api/user";
import { UserType } from "@/redux/reducer/UserReduce";
import store from "@/redux/store";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {

  const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

  const update = () => {
    store.dispatch(() => set_currentUser(store.getState().user))
  }
  useEffect(() => {
    update()
  }, [])

  const [_warn, set_warn] = useState<string>("")
  const [_post, set_post] = useState<any[]>([])
  const [_facillities, set_facilities] = useState<any[]>([])
  const [_news, set_news] = useState<any[]>([])
  const [_interview, set_interview] = useState<any[]>([])

  useEffect(() => {
    const getItem = async (position: string, archive: string, hostId: string) => {

      const result = await ApiItemUser({ position, archive, hostId, limit: 5 })
      if (result.success) {
        set_post(result.data)
      } else {
        set_warn(result.msg)
      }

    }
    if (_currentUser) {
      getItem(_currentUser.position, "post", _currentUser.id.toString())
    }
  }, [_currentUser, _currentUser.position])

  useEffect(() => {
    const getItem = async (position: string, archive: string, hostId: string) => {

      const result = await ApiItemUser({ position, archive, hostId, limit: 5 })
      if (result.success) {
        set_facilities(result.data)
      } else {
        set_warn(result.msg)
      }

    }
    if (_currentUser) {
      getItem(_currentUser.position, "facility", _currentUser.id.toString())
    }
  }, [_currentUser, _currentUser.position])


  useEffect(() => {
    const getItem = async (position: string, archive: string, hostId: string) => {

      const result = await ApiItemUser({ position, archive, hostId, limit: 5 })
      if (result.success) {
        set_news(result.data)
      } else {
        set_warn(result.msg)
      }

    }
    if (_currentUser) {
      getItem(_currentUser.position, "news", _currentUser.id.toString())
    }
  }, [_currentUser, _currentUser.position])

  useEffect(() => {
    const getItem = async (position: string, archive: string, hostId: string) => {

      const result = await ApiItemUser({ position, archive, hostId, limit: 5 })
      if (result.success) {
        set_interview(result.data)
      } else {
        set_warn(result.msg)
      }

    }
    if (_currentUser) {
      getItem(_currentUser.position, "interview", _currentUser.id.toString())
    }
  }, [_currentUser, _currentUser.position])

  const toPage = useRouter()
  return (
    <div className="h-full text-center">
      <div className="font-bold text-2xl">
        こんにちは, <span className="text-org-button">{_currentUser.username}</span>！
      </div>
      <div className="h-3"></div>
      <div className="font-bold text-3xl">
        若年層モデル事業就職サイトの管理ページです。
      </div>
      {_warn ? <div className='text-red-500'>{_warn}<br></br>アカウントを有効にするように、管理者に連絡してください。</div> : null}

      {
        _currentUser.position === "user" ?
          <div className="text-left ">
            <div className="h-12 flex flex-col justify-center font-bold text-xl px-4">求人情報</div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="px-4 grid grid-cols-12 py-2 bg-org-button/10 gap-1">
                <div className="justify-center text-sm font-bold col-span-4">タイトル</div>
                <div className="justify-center text-sm font-bold col-span-4">職業所</div>
                <div className="justify-center text-sm font-bold col-span-2">状況</div>
                <div className="justify-center text-sm font-bold col-span-2">作成日</div>
              </div>
              {_post.length ? _post.map((p, index) =>
                <div key={index} className="px-4 grid grid-cols-12 py-2 gap-1 cursor-pointer" onClick={() => toPage.push("/" + p.archive + "/" + p.slug)}>
                  <div className="justify-center col-span-4">{p.title}</div>
                  <div className="justify-center col-span-4">{p.workplace.name}</div>
                  <div className="justify-center col-span-2">{p.draft ? "下書き" : "公開済み"}</div>
                  <div className="justify-center col-span-2">{moment(p.createdAt).format("YYYY年MM月DD日")}</div>
                </div>) :
                <div className="px-4 py-2 gap-1 text-center"> {_warn ? <div className="text-red-500">{_warn}</div> : "求人情報がありません。"}</div>
              }
            </div>
            <div className="h-12"></div>
            <div className="h-12 justify-center font-bold text-xl px-4">施設</div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="px-4 grid grid-cols-12 py-2 bg-org-button/10 gap-1">
                <div className="justify-center font-bold text-sm col-span-6">施設名</div>
                <div className="justify-center font-bold text-sm col-span-2"></div>
                <div className="justify-center font-bold text-sm col-span-2">状況</div>
                <div className="justify-center font-bold text-sm col-span-2">作成日</div>
              </div>
              {_facillities.length ? _facillities.map((f, index) =>
                <div key={index} className="px-4 grid grid-cols-12 py-2 gap-1 cursor-pointer" onClick={() => toPage.push("/" + f.archive + "/" + f.slug)}>
                  <div className="justify-center col-span-6">{f.name}</div>
                  <div className="justify-center col-span-2">修正できる</div>
                  <div className="justify-center col-span-2">{f.draft ? "下書き" : "公開済み"}</div>
                  <div className="justify-center col-span-2">{moment(f.createdAt).format("YYYY年MM月DD日")}</div>
                </div>) :
                <div className="px-4 py-2 gap-1 text-center"> {_warn ? <div className="text-red-500">{_warn}</div> : "施設がありません。"}</div>
              }
            </div>
          </div> :
          <div className="text-left ">
            <div className="h-12 flex flex-col justify-center font-bold text-xl px-4">ニュース</div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="px-4 grid grid-cols-12 py-2 bg-org-button/10 gap-1">
                <div className="justify-center text-sm font-bold col-span-8">タイトル</div>
                <div className="justify-center text-sm font-bold col-span-2">状況</div>
                <div className="justify-center text-sm font-bold col-span-2">作成日</div>
              </div>
              {_news.length ? _post.map((p, index) =>
                <div key={index} className="px-4 grid grid-cols-12 py-2 gap-1 cursor-pointer" onClick={() => toPage.push("/" + p.archive + "/" + p.slug)}>
                  <div className="justify-center col-span-8">{p.title}</div>
                  <div className="justify-center col-span-2">{p.draft ? "下書き" : "公開済み"}</div>
                  <div className="justify-center col-span-2">{moment(p.createdAt).format("YYYY年MM月DD日")}</div>
                </div>) :
                <div className="px-4 py-2 gap-1 text-center"> {_warn ? <div className="text-red-500">{_warn}</div> : "ニュースがありません。"}</div>
              }
            </div>
            <div className="h-12 flex flex-col justify-center font-bold text-xl px-4">先輩たちの声</div>
            <div className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="px-4 grid grid-cols-12 py-2 bg-org-button/10 gap-1">
                <div className="justify-center text-sm font-bold col-span-6">タイトル</div>
                <div className="justify-center text-sm font-bold col-span-2">インタビュアー</div>
                <div className="justify-center text-sm font-bold col-span-2">状況</div>
                <div className="justify-center text-sm font-bold col-span-2">作成日</div>
              </div>
              {_interview.length ? _interview.map((p, index) =>
                <div key={index} className="px-4 grid grid-cols-12 py-2 gap-1 cursor-pointer" onClick={() => toPage.push("/" + p.archive + "/" + p.slug)}>
                  <div className="justify-center col-span-6">{p.contenttitle}</div>
                  <div className="justify-center col-span-2">{p.name}</div>
                  <div className="justify-center col-span-2">{p.draft ? "下書き" : "公開済み"}</div>
                  <div className="justify-center col-span-2">{moment(p.createdAt).format("YYYY年MM月DD日")}</div>
                </div>) :
                <div className="px-4 py-2 gap-1 text-center"> {_warn ? <div className="text-red-500">{_warn}</div> : "先輩たちの声がありません。"}</div>
              }
            </div>
          </div>
      }
    </div >
  );
}
