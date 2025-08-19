/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompositeDecorator, Editor, EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import React, { useEffect, useRef, useState } from 'react'
// import AddIcon from '@mui/icons-material/Add';
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
    // const createImage = async (editorState: EditorState) => {
    //     const selection = editorState.getSelection();
    //     const content = _editorState.getCurrentContent();
    //     const block = content.getBlockForKey(selection.getStartKey());
    //     const url = block.getText()
    //     const contentStateWithEntity = content.createEntity('IMAGE', 'MUTABLE', { src: url });
    //     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    //     const newEditorState = AtomicBlockUtils.insertAtomicBlock(_editorState, entityKey, ' ');
    //     set_EditorState(newEditorState);
    // }
    // const addAudio = async (url: string) => {
    //     const content = _editorState.getCurrentContent();
    //     const contentStateWithEntity = content.createEntity('AUDIO', 'MUTABLE', { src: url });
    //     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    //     const newEditorState = AtomicBlockUtils.insertAtomicBlock(_editorState, entityKey, ' ');
    //     set_EditorState(newEditorState);
    // }
    // const makeTextRight = async (value: EditorState) => {
    //     set_EditorState(RichUtils.toggleBlockType(value, 'text-right'));
    // }
    // const makeTextCenter = async (value: EditorState) => {
    //     set_EditorState(RichUtils.toggleBlockType(value, 'text-center'));
    // }

    const editRef: any = useRef("")

    // function myBlockStyleFn(contentBlock: { getType: () => string; }) {
    //     const type = contentBlock.getType();
    //     if (type === 'text-center') {
    //         return 'text-center';
    //     }
    //     if (type === 'text-right') {
    //         return 'text-right';
    //     }
    //     return '';
    // }
    // const getCurrentBlockType = (editorState: EditorState) => {
    //     const selection = editorState.getSelection();
    //     const content = editorState.getCurrentContent();
    //     const block = content.getBlockForKey(selection.getStartKey());
    //     return block.getType(); // Trả về kiểu như 'unstyled', 'header-one', 'blockquote', v.v.
    // };
    // const sx = `!h-full !w-full m-auto p-2 font-bold flex flex-col justify-center text-center`

    // const [_toolOpen, set_toolOpen] = useState<boolean>(false)
    // const [_toolInputOpen, set_toolInputOpen] = useState<boolean>(false)
    // const [_toolIndex, set_toolIndex] = useState<number>(0)

    return (
        <div className=' rounded'>
            <div className='h-12 sticky top-0 py-1 flex gap-1 z-[1] justify-between'>
                <div></div>
                {/* <AddIcon className='!w-10 !h-10 p-1 cursor-pointer' onClick={() => set_toolOpen(!_toolOpen)} /> */}
                {/* <div className={`${_toolOpen ? "block" : "hidden"} absolute right-1 top-13 h-24 shadow-md bg-white border border-slate-300 rounded-md overflow-hidden`}>
                    <div className="h-12 px-4 flex flex-col justify-center hover:bg-slate-100 cursor-pointer" onClick={() => { set_toolIndex(1); set_toolOpen(false) }}>画像を追加</div>
                    <div className="h-[1px] w-full bg-slate-300"></div>
                    <div className="h-12 px-4 flex flex-col justify-center hover:bg-slate-100 cursor-pointer" onClick={() => { set_toolIndex(2); set_toolOpen(false) }}>リンクを追加</div>
                </div> */}
            </div>

            <div className='dangerous_box border bg-white border-slate-300 min-h-96 p-4 overflow-x-auto scroll_none cursor-text text-justify text-sm md:text-base' onClick={() => editRef.current.focus()}>
                <Editor ref={editRef} editorState={_editorState} onChange={(editorState) => set_EditorState(editorState)} />
            </div>
        </div>
    )
}

export default TextArea

