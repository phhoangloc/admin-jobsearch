/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompositeDecorator, Editor, EditorState, RichUtils } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import React, { useEffect, useRef, useState } from 'react'
// import ImageIcon from '@mui/icons-material/Image';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
// import PlaylistAddCircleIcon from '@mui/icons-material/PlaylistAddCircle';
type Props = {
    value: string,
    onchange: (v: string) => void
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

    const createBlockStyle = (value: EditorState, type: string) => {
        set_EditorState(RichUtils.toggleBlockType(value, type));
    }
    const createInlineStyle = (value: any, type: string) => {
        set_EditorState(RichUtils.toggleInlineStyle(value, type));
    }
    // const createImage = async (url: string) => {
    //     const content = _editorState.getCurrentContent();
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
    const makeTextRight = async (value: EditorState) => {
        set_EditorState(RichUtils.toggleBlockType(value, 'text-right'));
    }
    const makeTextCenter = async (value: EditorState) => {
        set_EditorState(RichUtils.toggleBlockType(value, 'text-center'));
    }

    const editRef: any = useRef("")

    function myBlockStyleFn(contentBlock: { getType: () => string; }) {
        const type = contentBlock.getType();
        if (type === 'text-center') {
            return 'text-center';
        }
        if (type === 'text-right') {
            return 'text-right';
        }
        return '';
    }
    const getCurrentBlockType = (editorState: EditorState) => {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const block = content.getBlockForKey(selection.getStartKey());
        return block.getType(); // Trả về kiểu như 'unstyled', 'header-one', 'blockquote', v.v.
    };
    const sx = `!h-full !w-full m-auto p-2 font-bold flex flex-col justify-center text-center`

    const tool = [
        {
            name: <div className={`${sx} text-white ${getCurrentBlockType(_editorState) === "header-one" ? "bg-orange-600" : "bg-org-button"}`}>{`h1`}</div>,
            func: () => createBlockStyle(_editorState, "header-one"),
            type: "header-one",
        },
        {
            name: <div className={`${sx} text-white ${getCurrentBlockType(_editorState) === "header-two" ? "bg-orange-600" : "bg-org-button"}`}>{`h2`}</div>,
            func: () => createBlockStyle(_editorState, "header-two"),
            type: "header-two",
        },
        {
            name: <div className={`${sx} text-white ${getCurrentBlockType(_editorState) === "header-three" ? "bg-orange-600" : "bg-org-button"}`}>{`h3`}</div>,
            func: () => createBlockStyle(_editorState, "header-three"),
            type: "header-three",
        },
        {
            name: <div className={`${sx} text-white ${getCurrentBlockType(_editorState) === "header-four" ? "bg-orange-600" : "bg-org-button"}`}>{`h4`}</div>,
            func: () => createBlockStyle(_editorState, "header-four"),
            type: "header-four",
        },

        {
            name: <div className={`${sx} text-white ${getCurrentBlockType(_editorState) === "header-five" ? "bg-orange-600" : "bg-org-button"}`}>{`h5`}</div>,
            func: () => createBlockStyle(_editorState, "header-five"),
            type: "header-five",
        },
        // {
        //     name: <div className={`${sx} text-white ${getCurrentBlockType(_editorState) === "code-block" ? "bg-orange-600" : "bg-org-button"}`}>{`</>`}</div>,
        //     func: () => createBlockStyle(_editorState, "code-block"),
        //     type: "code-block",
        // },
        {
            name: <FormatBoldIcon className={`!h-full !w-full m-auto p-2 text-white ${_editorState.getCurrentInlineStyle().has("BOLD") ? "bg-orange-600" : "bg-org-button"}`} />,
            func: () => createInlineStyle(_editorState, "BOLD"),
            type: "BOLD",
        },
        {
            name: <FormatItalicIcon className={`!h-full !w-full m-auto p-2 text-white ${_editorState.getCurrentInlineStyle().has("ITALIC") ? "bg-orange-600" : "bg-org-button"}`} />,
            func: () => createInlineStyle(_editorState, "ITALIC"),
            type: "ITALIC",
        },
        // {
        //     name: <ImageIcon className={`${sx} text-white bg-white cursor-pointer`} />,
        //     func: () => set_isGetPic(true),
        // },
        // {
        //     name: <PlaylistAddCircleIcon className={`${sx} text-white bg-white cursor-pointer`} />,
        //     func: () => set_isGetAudio(true),
        // },
        {
            name: <FormatAlignCenterIcon className={`${sx} text-white ${getCurrentBlockType(_editorState) === "text-center" ? "bg-orange-600" : "bg-org-button"}`} />,
            func: () => makeTextCenter(_editorState),
            type: "text-center",
        },
        {
            name: <FormatAlignRightIcon className={`${sx} text-white ${getCurrentBlockType(_editorState) === "text-right" ? "bg-orange-600" : "bg-org-button"}`} />,
            func: () => makeTextRight(_editorState),
            type: "text-right",
        },
    ]

    // const getUrl = (url: string) => {
    //     if (_isGetPic) {
    //         createImage(url)
    //     }
    //     if (_isGetAudio) {
    //         addAudio(url)
    //     }

    //     set_isGetAudio(false)
    //     set_isGetPic(false)
    // }
    return (
        <div className=' rounded'>
            <div className='sticky top-0 py-1 flex gap-1 z-[1] flex-wrap'>
                {
                    tool.map((tl, index) =>
                        <div key={index}
                            className={`h-10 aspect-square overflow-hidden shadow rounded`}
                            onClick={tl.func}>{tl.name}</div>
                    )
                }
            </div>

            <div className='dangerous_box border bg-white border-slate-300 min-h-96 p-4 overflow-x-auto scroll_none cursor-text text-justify text-sm md:text-base' onClick={() => editRef.current.focus()}>
                <Editor ref={editRef} editorState={_editorState} onChange={(editorState) => set_EditorState(editorState)} blockStyleFn={myBlockStyleFn} />
            </div>
        </div>
    )
}

export default TextArea

