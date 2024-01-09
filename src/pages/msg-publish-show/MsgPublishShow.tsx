/*
 * 2051565 GTY
 * 创建于2024年1月6日 广东省韶关市（高铁线）
 */

import React, { useState } from "react";
import PageRouteManager from "../../common/PageRoutes";
import { later } from "../../utils/later";
import { loadPageToLayoutFrame, setLayoutFrameTitle } from "../../components/LayoutFrame/LayoutFrame";
import HttpUrlUtils from "../../utils/HttpUrlUtils";
import { Spin, message } from "antd";
import TJApi from "../../utils/TJApi";

import '../../index.css'
import { useConstructor } from "../../utils/react-functional-helpers";
import { useSearchParams } from "react-router-dom";

interface MsgPublishShowPageState {
    loading: boolean
    msgInfo: {
        contentHtml: string
        createUser: string
        publishTime: string
        title: string
    }
}

export default function MsgPublishShowPage() {

    const [state, setState] = useState<MsgPublishShowPageState>({
        loading: true,
        msgInfo: {
            contentHtml: "",
            createUser: "...",
            publishTime: "...",
            title: "..."
        }
    })

    const pageEntity = PageRouteManager.getRouteEntity('msg-publish-show')
    const [searchParams, setSearchParams] = useSearchParams()
    useConstructor(constructor)
    function constructor() {

        later(() => {
            loadPageToLayoutFrame(pageEntity)
            
            if (searchParams.has('msgid')) {
                let id = searchParams.get('msgid')!
                loadData(id)
            } else {
                message.error('bad argument: msgid required!')
            }
        })
    }

    function toMobileFriendlyHtml(html: string): string {
        let head = "<head>" +
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"> " +
            "<style>img{max-width: 100%; width:100%; height:auto;}*{margin:0px;}</style>" +
            "</head>"
        
            return "<html>".concat(head)
                .concat("<body>")
                .concat(html)
                .concat("</body></html>")
    }

    function loadData(msgIdStr: string) {
        let msgId = Number(msgIdStr)
        TJApi.instance().getOneTongjiMessageDetail(msgId).then(res => {

            state.msgInfo = {
                contentHtml: toMobileFriendlyHtml(res.content),
                createUser: res.createUser,
                publishTime: res.publishTime,
                title: res.title
            }
            
            setState({...state})

            setLayoutFrameTitle(res.title)

        }).catch(err => {
            // do nothing.
        }).finally(() => {
            state.loading = false
            setState({...state})
        })
    }


    /* render */

    return <div
        className="overflow-y-overlay"
        style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',

            boxSizing: 'border-box',
            padding: 16
        }}
    >
        <Spin
            spinning={state.loading}
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        />

        { /* 发布者姓名 与 发布时间。 */ }
        <div
            style={{
                position: 'relative',
                fontSize: 20,

                padding: 12,
                boxSizing: 'border-box',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                borderRadius: 12,
                border: '1px solid #7777'
            }}
        >
            <div>
                { state.msgInfo.createUser }
            </div>


            <div
                style={{
                    textAlign: 'right',
                    flexGrow: 1,
                }}
            >
                { state.msgInfo.publishTime }
            </div>
        </div>

        { /* 新闻内容。 */ }

        <div 
            style={{
                marginTop: 16
            }}
            dangerouslySetInnerHTML={{ 
                __html: state.msgInfo.contentHtml
            }}
        />

    </div>

}
