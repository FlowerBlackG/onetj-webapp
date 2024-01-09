/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import React, { useState } from 'react';
import './Home.css'
import { later } from '../../utils/later';
import { loadPageToLayoutFrame } from '../../components/LayoutFrame/LayoutFrame';
import TJApi, { TJApiOneTongjiSchoolCalendar, TJApiStudentInfo } from '../../utils/TJApi';
import { Modal, message } from 'antd';
import { Navigate, redirect, redirectDocument, useNavigate } from 'react-router-dom';
import URLNavigate from '../../utils/URLNavigate';
import PageRouteManager from '../../common/PageRoutes';
import { InfoCardBuilder } from '../../components/InfoCard/InfoCard';
import FluentUIEmojiProxy from '../../utils/FluentUIEmojiProxy';
import { useConstructor } from '../../utils/react-functional-helpers';

interface HomePageState {
    userInfo: TJApiStudentInfo
    termInfo: TJApiOneTongjiSchoolCalendar

    commonMsgPublishList: CommonMsgPublishData[]

    onNavigateTo: boolean
    navigateToDestination: string
}

interface OneTJFunctionEntry {
    title: string
    icon: string
    onClick: () => void
}

interface CommonMsgPublishData {
    id: number
    title: string
    date: string
}

export default function HomePage() {

    const pageEntity = PageRouteManager.getRouteEntity('home')

    const [state, setState] = useState<HomePageState>({
        userInfo: {
            userId: '...',
            name: '谢宇菲',
            gender: 0,
            deptName: '...',
            secondDeptName: '',
            schoolName: '',
            currentGrade: '...'
        },

        termInfo: {
            calendarId: '',
            year: '',
            term: '',
            schoolWeek: '...',
            simpleName: '...'
        },

        commonMsgPublishList: [],

        onNavigateTo: false,
        navigateToDestination: ''
    })

    const navigate = useNavigate()

    useConstructor(constructor)
    function constructor() {

        later(() => {
            loadPageToLayoutFrame(pageEntity)
            loadUserBasicData()
            loadTermBasicInfo()
            loadCommonMsgPublish() // 首页新闻
        })
    }


    /* 功能金刚位。 */

    const oneTJFunctions: OneTJFunctionEntry[] = [
        {
            title: '今日课表',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/alarm_clock_color.svg',
            onClick: () => { navigateTo('/func/student-timetable/single-day') }
        },
        {
            title: '学期课表',
            icon: FluentUIEmojiProxy.colorSvg('notebook_color'),
            onClick: () => { 
                let termName = state.termInfo.simpleName
                let targetUrl = '/func/student-timetable/term-complete'
                    
                navigate({ 
                    pathname: targetUrl,
                    search: '?termName='.concat(termName)
                 })
            }
        },
        {
            title: '我的成绩',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/anguished_face_color.svg',
            onClick: () => { navigate({ pathname: '/func/my-grades' }) }
        },
        {
            title: '我的考试',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/memo_color.svg',
            onClick: () => { navigateTo('/func/stu-exam-enquiries') }
        },
        {
            title: '四六级',
            icon: FluentUIEmojiProxy.colorSvg('money_with_wings_color'),
            onClick: () => { navigateTo('/func/cet-score') }
        },
        {
            title: '体测体锻',
            icon: FluentUIEmojiProxy.colorSvg('badminton_color'),
            onClick: () => { navigateTo('/func/sports-test-data') }
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
                        navigate({
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
            onClick: () => { navigateTo('/about') }
        }
    ]

    function navigateTo(path: string) {
        state.navigateToDestination = path
        state.onNavigateTo = true
        setState({
            ...state
        })
    }

    function loadUserBasicData() {
        TJApi.instance().getStudentInfo().then(res => {
            state.userInfo = res
            setState({...state})
        }).catch(err => {})
    }

    function loadTermBasicInfo() {
        TJApi.instance().getOneTongjiSchoolCalendar().then(res => {
            state.termInfo = res
            setState({...state})
        }).catch(err => {})
    }

    function loadCommonMsgPublish() {
        TJApi.instance().getOneTongjiMessageList().then(res => {
            let msgs = [] as CommonMsgPublishData[]
            for (let it of res) {
                msgs.push({
                    id: it.id,
                    title: it.title,
                    date: it.publishTime.split(' ')[0]
                })
            }

            state.commonMsgPublishList = msgs
            setState({...state})

        })
    }
    

    function userDataCard(): React.ReactNode {

        let avatarUrl = 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/smiling_face_with_hearts_color.svg'

        if (state.userInfo.gender === 1) { // male
            avatarUrl = 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/sleeping_face_color.svg'
        }

        return <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '96%',
                maxWidth: 480,
                justifyContent: 'center',
                flexShrink: 0,
                margin: '0 auto', // 水平居中
                userSelect: 'none'
            }}
        >
            <img 
                src={ avatarUrl }
                width={ 72 }
                style={{
                    width: 72
                }}
            />

            <div style={{ width: 24 }} />

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    wordBreak: 'break-all',
                    textAlign: 'left',
                    fontSize: 24
                }}
            >
                {state.userInfo.name} {state.userInfo.userId}
                <br />
                {state.userInfo.deptName}
                <br />
                {state.userInfo.currentGrade}级
            </div>
        </div>
    }

    function functionEntryGrid(): React.ReactNode {

        const cols = 4
        const percentsPerCol = (98.0 / cols).toPrecision(3)

        let gridTemplateColumns = ''
        for (let i = 0; i < cols; i++) {
            if (gridTemplateColumns !== '') {
                gridTemplateColumns += ' '
            }

            gridTemplateColumns += percentsPerCol
            gridTemplateColumns += '%'
        }

        return <div
            style={{
                display: 'grid',
                gridTemplateColumns: gridTemplateColumns,
            }}
        > {

            oneTJFunctions.map((entry) => {

                return <div
                    className='function-card-container'
                    onClick={ entry.onClick }
                >
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >

                        <img src={entry.icon} width={ 56 } />
                        <div style={{ height: 8 }} />
                        {entry.title}
                    </div>
                </div>

            })

        } </div>
    }

    function messageList(): React.ReactNode {
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0 auto'
            }}
        > {
            state.commonMsgPublishList.map(msg => {
                return <div
                    className='msg-card'
                    onClick={() => {
                        let id = msg.id
                        let destPath = '/msg-publish-show'
                        let search = '?msgid='.concat(id.toString())
                        navigate({
                            pathname: destPath,
                            search: search
                        })
                    }}
                >
                    
                    { /* 标题。 */ }
                    <div
                        style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            right: 8,
                        }}
                    >
                        {msg.title}
                    </div>
                    
                    { /* 日期。 */ }
                    <div
                        style={{
                            position: 'absolute',
                            right: 8,
                            bottom: 8
                        }}
                    >
                        {msg.date}
                    </div>

                </div>
            })
        } </div>
    }


    /* render */


    if (state.onNavigateTo) {
        return <Navigate to={ state.navigateToDestination } />
    }

    return <div className='container'>

        <div
            style={{
                fontSize: 22,
                width: '100%',
                textAlign: 'center',
                flexShrink: 0
            }}
        >
            <div style={{ height: 24 }} />

            { userDataCard() }

            <div style={{ height: 24 }} />
            
            { state.termInfo.simpleName } 第{ state.termInfo.schoolWeek }周
        </div>

        <div style={{ height: 24, flexShrink: 0 }} />

        { /* 功能与通知区域。 */ }
        <div
            className='overflow-y-overlay'
            style={{ flexGrow: 1 }}
        >

            { /* 功能入口。 */ }
            { functionEntryGrid() }
        
            { /* 通知入口。 */ }
            { messageList() }

            <div style={{ height: 12 }} />
        </div>

    </div>


}
