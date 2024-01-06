/*
 * 2051565 GTY
 * 创建于2024年1月6日 广东省韶关市（高铁线）
 */

import React from "react";
import PageRouteManager from "../../common/PageRoutes";
import { later } from "../../utils/later";
import { loadPageToLayoutFrame, setLayoutFrameTitle } from "../../components/LayoutFrame/LayoutFrame";
import HttpUrlUtils from "../../utils/HttpUrlUtils";
import { Spin, message } from "antd";
import TJApi from "../../utils/TJApi";

import '../../index.css'

interface MsgPublishShowPageState {
    loading: boolean
    msgInfo: {
        contentHtml: string
        createUser: string
        publishTime: string
        title: string
    }
}

export default class MsgPublishShowPage extends React.Component<
    any, MsgPublishShowPageState
> {

    state: MsgPublishShowPageState = {
        loading: true,
        msgInfo: {
            contentHtml: "",
            createUser: "...",
            publishTime: "...",
            title: "..."
        }
    }

    pageEntity = PageRouteManager.getRouteEntity('msg-publish-show')
    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
            
            let args = HttpUrlUtils.getUrlData().args
            if (args.has('msgid')) {
                let id = args.get('msgid')!
                this.loadData(id)
            } else {
                message.error('bad argument: msgid required!')
            }
        })
    }

    toMobileFriendlyHtml(html: string): string {
        let head = "<head>" +
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\"> " +
            "<style>img{max-width: 100%; width:100%; height:auto;}*{margin:0px;}</style>" +
            "</head>"
        
            return "<html>".concat(head)
                .concat("<body>")
                .concat(html)
                .concat("</body></html>")
    }

    loadData(msgIdStr: string) {
        let msgId = Number(msgIdStr)
        TJApi.instance().getOneTongjiMessageDetail(msgId).then(res => {

            this.setState({
                msgInfo: {
                    contentHtml: this.toMobileFriendlyHtml(res.content),
                    createUser: res.createUser,
                    publishTime: res.publishTime,
                    title: res.title
                },

                loading: false
            })

            setLayoutFrameTitle(res.title)

        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }

    override render(): React.ReactNode {
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
                spinning={this.state.loading}
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
                    { this.state.msgInfo.createUser }
                </div>


                <div
                    style={{
                        textAlign: 'right',
                        flexGrow: 1,
                    }}
                >
                    { this.state.msgInfo.publishTime }
                </div>
            </div>

            { /* 新闻内容。 */ }

            <div 
                style={{
                    marginTop: 16
                }}
                dangerouslySetInnerHTML={{ 
                    __html: this.state.msgInfo.contentHtml
                }}
            />

        </div>
    }
}
