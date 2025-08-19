/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtomicBlockUtils, CompositeDecorator, Editor, EditorState, Modifier, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
// import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
// import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
// import FormatBoldIcon from '@mui/icons-material/FormatBold';
// import FormatItalicIcon from '@mui/icons-material/FormatItalic';
// import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
type Props = {
    value: string,
    onchange: (v: string) => void,
    picButton?: boolean
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
    }
]);

const TextArea = ({ value, onchange }: Props) => {

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

    // const createBlockStyle = (value: EditorState, type: string) => {
    //     set_EditorState(RichUtils.toggleBlockType(value, type));
    // }
    // const createInlineStyle = (value: any, type: string) => {
    //     set_EditorState(RichUtils.toggleInlineStyle(value, type));
    // }
    const createImage = async (url: string) => {
        const content = _editorState.getCurrentContent();
        const contentStateWithEntity = content.createEntity('IMAGE', 'MUTABLE', { src: url });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(_editorState, entityKey, ' ');
        set_EditorState(newEditorState);
    }
    const createLink = (value: string) => {
        const content = _editorState.getCurrentContent();
        const contentStateWithEntity = content.createEntity('LINK', 'MUTABLE', { url: value });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newContentState = Modifier.applyEntity(
            contentStateWithEntity,
            _editorState.getSelection(),
            entityKey
        );
        let newEditorState = EditorState.push(_editorState, newContentState, 'apply-entity');
        newEditorState = newEditorState.getCurrentInlineStyle().has("UNDERLINE") ? RichUtils.toggleInlineStyle(newEditorState, '') : RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE');
        set_EditorState(newEditorState);

    }

    const editRef: any = useRef("")



    const [_toolOpen, set_toolOpen] = useState<boolean>(false)
    const [_toolIndex, set_toolIndex] = useState<number>(0)
    const [_url, set_url] = useState<string>("")

    const submit = (index: number, url: string) => {
        if (index == 1) {
            createImage(url)
            set_url("")
            set_toolIndex(0)
        }
        if (index == 2) {
            createLink(url)
            set_url("")
            set_toolIndex(0)
        }
    }
    return (
        <div className=''>
            <div className='h-12 sticky top-0 py-1 flex gap-1 z-[1] justify-between bg-org-bg'>
                {_toolIndex ? <div className='flex gap-2'>
                    <input className='border w-60 border-slate-300 bg-white rounded' onChange={(e) => set_url(e.currentTarget.value)} value={_url}></input>
                    <div className='w-20 text-center text-sm flex flex-col justify-center rounded bg-org-button text-white' onClick={() => submit(_toolIndex, _url)}>追加</div>
                    <div className='w-20 text-center text-sm flex flex-col justify-center rounded border text-org-button' onClick={() => { set_toolOpen(false); set_toolIndex(0) }}>キャンセル</div>
                </div> : <div></div>}
                <AddIcon className='!w-10 !h-10 p-1 cursor-pointer' onClick={() => set_toolOpen(!_toolOpen)} />
                <div className={`${_toolOpen ? "block" : "hidden"} absolute right-1 top-13 h-24 shadow-md bg-white border border-slate-300 rounded-md overflow-hidden`}>
                    <div className="h-12 px-4 flex flex-col justify-center hover:bg-slate-100 cursor-pointer" onClick={() => { set_toolIndex(1); set_toolOpen(false) }}>画像を追加</div>
                    <div className="h-[1px] w-full bg-slate-300"></div>
                    <div className="h-12 px-4 flex flex-col justify-center hover:bg-slate-100 cursor-pointer" onClick={() => { set_toolIndex(2); set_toolOpen(false) }}>リンクを追加</div>
                </div>
            </div>

            <div className='dangerous_box border bg-white border-slate-300 min-h-96 p-4 overflow-x-auto scroll_none cursor-text text-justify text-sm md:text-base' onClick={() => editRef.current.focus()}>
                <Editor ref={editRef} editorState={_editorState} onChange={(editorState) => set_EditorState(editorState)} />
            </div>
        </div>
    )
}

export default TextArea

