/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtomicBlockUtils, CompositeDecorator, Editor, EditorState, Modifier, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import React, { useEffect, useRef, useState } from 'react'
// import ImageIcon from '@mui/icons-material/Image';
// import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
// import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
// import FormatBoldIcon from '@mui/icons-material/FormatBold';
// import FormatItalicIcon from '@mui/icons-material/FormatItalic';
// import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
import UploadIcon from '@mui/icons-material/Upload';
import { ApiUploadFile } from '@/api/user';
import { UserType } from '@/redux/reducer/UserReduce';
import store from '@/redux/store';
import { setModal } from '@/redux/reducer/ModalReduce';
import { UploadButton } from '../button/button';
type Props = {
    value: string,
    onchange: (v: string) => void,
    tool?: boolean
}
const Image = (props: any) => {
    const { src } = props.contentState.getEntity(props.entityKey).getData();
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className='w-full' />;
};
const Audio = (props: any) => {
    const { src } = props.contentState.getEntity(props.entityKey).getData();
    return <audio controls src={src} className='w-full' />;
};
const Link = (props: any) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return <a href={url} style={{ textDecoration: "underline" }} target="_blank" rel="noreferrer">
        {props.children}
    </a>
};
const decorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE'
                );
            }, callback);
        },
        component: Image,
    },
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'AUDIO'
                );
            }, callback);
        },
        component: Audio,
    },
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK'
                );
            }, callback);
        }, component: Link,
    },
]);

const TextArea = ({ value, onchange, tool }: Props) => {

    const [_currentUser, set_currentUser] = useState<UserType>(store.getState().user)

    const update = () => {
        store.subscribe(() => set_currentUser(store.getState().user))
    }

    useEffect(() => {
        update()
    }, [])


    const [_outPut, set_outPut] = useState<string>("")
    const [_editorState, set_EditorState] = useState(EditorState.createEmpty(decorator));
    // const [_isGetPic, set_isGetPic] = useState<boolean>(false)
    // const [_isGetAudio, set_isGetAudio] = useState<boolean>(false)

    useEffect(() => {
        const _stateContent = stateFromHTML(value)
        set_EditorState(EditorState.createWithContent(_stateContent, decorator))
    }, [value])

    useEffect(() => {
        const _stateContent = _editorState.getCurrentContent()
        const _content = stateToHTML(_stateContent, {
            blockStyleFn: (block) => {
                const type = block.getType();
                if (type === 'text-center') {
                    return {
                        attributes: { class: 'text-center' },
                    };
                }
                if (type === 'text-right') {
                    return {
                        attributes: { class: 'text-right' },
                    };
                }
            },
        })
        set_outPut(_content)
    }, [_editorState])

    useEffect(() => {
        onchange(_outPut)
    }, [_outPut, onchange])
    const createImage = async (url: string) => {
        const content = _editorState.getCurrentContent();
        const contentStateWithEntity = content.createEntity('IMAGE', 'MUTABLE', { src: url });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(_editorState, entityKey, ' ');
        set_EditorState(newEditorState);
    }

    const getFile = async (e: any) => {
        const files = e.target.files;
        const file: File | undefined = files ? files[0] : undefined
        const reader: FileReader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = async function () {
                const result = await ApiUploadFile({ position: _currentUser.position, archive: "file", file })
                if (result.success) {
                    store.dispatch(setModal({ open: true, value: "", msg: "作成成功！", type: "notification" }))
                    createImage(process.env.ftp_url + result.data.name)
                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);
                } else {
                    console.log(result.data)
                    store.dispatch(setModal({ open: true, value: "", msg: "エラー", type: "notification" }))
                    setTimeout(() => {
                        store.dispatch(setModal({ open: false, value: "", msg: "", type: "" }))
                    }, 3000);
                }
            }
        }

    }



    const editRef: any = useRef("")

    const toggleHighlight = () => {
        set_EditorState(
            RichUtils.toggleInlineStyle(_editorState, "HIGHLIGHT")
        );
    };

    const [_isAddLink, set_IsAddLink] = useState<boolean>(false)
    const [_url, set_url] = useState<string>("")

    const addLink = (url: string) => {
        const selection = _editorState.getSelection();
        if (!selection.isCollapsed()) {


            const contentState = _editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", {
                url,
            });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

            const contentStateWithLink = Modifier.applyEntity(
                contentStateWithEntity,
                selection,
                entityKey
            );

            set_EditorState(
                EditorState.push(_editorState, contentStateWithLink, "apply-entity")
            );
            set_url("")
            set_IsAddLink(false)
            toggleHighlight()
        }
    }

    return (
        <div className=' rounded'>
            {tool ?
                <div className='h-12 sticky top-0 py-1 flex gap-1 bg-org-bg'>
                    <UploadButton onClick={(e) => getFile(e)} name={<div className='border rounded-3xl py-1 px-4 bg-white cursor-pointer'><UploadIcon /> ファイルをアップロード</div>} />
                    {_isAddLink ?
                        <div className='flex gap-2'>
                            <input className='border w-60 border-slate-300 bg-white rounded' onChange={(e) => set_url(e.currentTarget.value)} value={_url}></input>
                            <div className='w-20 text-center text-sm flex flex-col justify-center rounded-3xl  border text-org-button' onClick={() => { set_IsAddLink(false); toggleHighlight() }}>キャンセル</div>
                            <div className='w-20 text-center text-sm flex flex-col justify-center rounded-3xl  bg-org-button text-white' onClick={() => addLink(_url)}>追加</div>
                        </div> :
                        <div className='border rounded-3xl py-1 px-4 bg-white cursor-pointer' onClick={() => { set_IsAddLink(true); toggleHighlight() }}> リンクを設定</div>
                    }
                </div> :
                null}

            <div className='dangerous_box border bg-white border-slate-300 min-h-96 p-4 overflow-x-auto scroll_none cursor-text text-justify text-sm md:text-base' onClick={() => editRef.current.focus()}>
                <Editor ref={editRef} editorState={_editorState} onChange={(editorState) => set_EditorState(editorState)} customStyleMap={{
                    HIGHLIGHT: { backgroundColor: "#ddd", color: "black" },
                }} />
            </div>
        </div>
    )
}

export default TextArea