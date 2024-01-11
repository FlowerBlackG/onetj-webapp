/*
 * 2051565 GTY
 * 创建于2024年1月11日 海南省三亚市
 */

import { Modal, message } from "antd"
import FluentUIEmojiProxy from "../../utils/FluentUIEmojiProxy"
import { HomePageState } from "./Home"
import TJApi from "../../utils/TJApi"
import { NavigateFunction, SetURLSearchParams } from "react-router-dom"

export interface OneTJFunctionEntry {
    title: string
    icon: string
    onClick: () => void
}

const hooks = {
    navigate: undefined as any,
    navigateTo: undefined as any,
    getState: undefined as any,
    getSearchParams: undefined as any,
    setSearchParams: undefined as any,

}

export class OneTJFunctions {
    protected constructor() {}

    /* 功能金刚位 - 开始 */

    static entries: OneTJFunctionEntry[] = [
        {
            title: '今日课表',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/alarm_clock_color.svg',
            onClick: () => { 
                hooks.navigate({
                    pathname: '/func/student-timetable/single-day',
                    search: '?termWeek='.concat(hooks.getState().termInfo.schoolWeek)
                }) 
            }
        },
        {
            title: '学期课表',
            icon: FluentUIEmojiProxy.colorSvg('notebook_color'),
            onClick: () => { 
                let termName = hooks.getState().termInfo.simpleName
                let targetUrl = '/func/student-timetable/term-complete'
                    
                hooks.navigate({ 
                    pathname: targetUrl,
                    search: '?termName='.concat(termName)
                })
            }
        },
        {
            title: '我的成绩',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/anguished_face_color.svg',
            onClick: () => { hooks.navigate({ pathname: '/func/my-grades' }) }
        },
        {
            title: '我的考试',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/memo_color.svg',
            onClick: () => { hooks.navigateTo('/func/stu-exam-enquiries') }
        },
        {
            title: '四六级',
            icon: FluentUIEmojiProxy.colorSvg('money_with_wings_color'),
            onClick: () => { hooks.navigateTo('/func/cet-score') }
        },
        {
            title: '体测体锻',
            icon: FluentUIEmojiProxy.colorSvg('badminton_color'),
            onClick: () => { hooks.navigateTo('/func/sports-test-data') }
        },
        {
            title: '全校课表',
            icon: FluentUIEmojiProxy.colorSvg('speedboat_color'),
            onClick: () => { message.error('敬请期待') }
        },
        {
            title: '退出登录',
            icon: FluentUIEmojiProxy.colorSvg('wilted_flower_color'),
            onClick: () => { 
                Modal.warn({
                    title: '真的要退出么？',
                    closable: true,
                    maskClosable: true,
                    centered: true,
                    okText: '退出',
                    onCancel: () => {},
                    onOk: () => {
                        TJApi.instance().clearCache()
                        hooks.navigate({
                            pathname: '/login'
                        })
                        
                    }
                    
                })    
            }
        },
        {
            title: '加讨论群',
            icon: FluentUIEmojiProxy.colorSvg('zany_face_color'),
            onClick: () => { 
                Modal.info({
                    title: '加入QQ群',
                    closable: true,
                    content: <div>
                        <img src='https://canfish.oss-cn-shanghai.aliyuncs.com/app/onetj-webapp/qq_group_qrcode.webp' width={160} />
                        群号：322324184
                    </div> ,
                    centered: true,
                    maskClosable: true,
                    
                })    
            }
        },
        {
            title: '关于App',
            icon: FluentUIEmojiProxy.colorSvg('teddy_bear_color'),
            onClick: () => { hooks.navigateTo('/about') }
        }
    ]


    /* 功能金刚位 - 结尾 */

    static loadHooks(
        navigate: NavigateFunction,
        navigateTo: (path: string) => void,
        getState: () => HomePageState,
        getSearchParams: () => URLSearchParams,
        setSearchParams: SetURLSearchParams,
    ) {
        hooks.getState = getState
        hooks.navigate = navigate
        hooks.navigateTo = navigateTo
        hooks.getSearchParams = getSearchParams
        hooks.setSearchParams = setSearchParams
    }
}