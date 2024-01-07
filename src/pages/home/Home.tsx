/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import React from 'react';
import './Home.css'
import { later } from '../../utils/later';
import { loadPageToLayoutFrame } from '../../components/LayoutFrame/LayoutFrame';
import TJApi, { TJApiOneTongjiSchoolCalendar, TJApiStudentInfo } from '../../utils/TJApi';
import { Modal, message } from 'antd';
import { Navigate, redirect, redirectDocument } from 'react-router-dom';
import URLNavigate from '../../utils/URLNavigate';
import PageRouteManager from '../../common/PageRoutes';
import { InfoCardBuilder } from '../../components/InfoCard/InfoCard';
import FluentUIEmojiProxy from '../../utils/FluentUIEmojiProxy';

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

export default class HomePage extends React.Component<
    any, HomePageState
> {

    pageEntity = PageRouteManager.getRouteEntity('home')

    state: HomePageState = {
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
    }

    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
            this.loadUserBasicData()
            this.loadTermBasicInfo()
            this.loadCommonMsgPublish() // 首页新闻

            TJApi.instance().getOneTongjiCetScore()
        })
    }


    /* 功能金刚位。 */

    oneTJFunctions: OneTJFunctionEntry[] = [
        {
            title: '今日课表',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/alarm_clock_color.svg',
            onClick: () => { this.navigateTo('/func/student-timetable/single-day') }
        },
        {
            title: '学期课表',
            icon: FluentUIEmojiProxy.colorSvg('notebook_color'),
            onClick: () => { 
                let termName = this.state.termInfo.simpleName
                let targetUrl = '/func/student-timetable/term-complete?termName='
                    .concat(termName)
                this.navigateTo(targetUrl) 
            }
        },
        {
            title: '我的成绩',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/anguished_face_color.svg',
            onClick: () => { this.navigateTo('/func/my-grades') }
        },
        {
            title: '我的考试',
            icon: 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/memo_color.svg',
            onClick: () => { this.navigateTo('/func/stu-exam-enquiries') }
        },
        {
            title: '四六级',
            icon: FluentUIEmojiProxy.colorSvg('money_with_wings_color'),
            onClick: () => { this.navigateTo('/func/cet-score') }
        },
        {
            title: '体测体锻',
            icon: FluentUIEmojiProxy.colorSvg('badminton_color'),
            onClick: () => { this.navigateTo('/func/sports-test-data') }
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
                        URLNavigate.to('/')
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
            onClick: () => { this.navigateTo('/about') }
        }
    ]

    navigateTo(path: string) {
        this.state.navigateToDestination = path
        this.setState({
            onNavigateTo: true
        })
    }

    loadUserBasicData() {
        TJApi.instance().getStudentInfo().then(res => {
            this.setState({
                userInfo: res
            })
        }).catch(err => {})
    }

    loadTermBasicInfo() {
        TJApi.instance().getOneTongjiSchoolCalendar().then(res => {
            this.setState({
                termInfo: res
            })
        }).catch(err => {})
    }

    loadCommonMsgPublish() {
        TJApi.instance().getOneTongjiMessageList().then(res => {
            let msgs = [] as CommonMsgPublishData[]
            for (let it of res) {
                msgs.push({
                    id: it.id,
                    title: it.title,
                    date: it.publishTime.split(' ')[0]
                })
            }

            this.setState({
                commonMsgPublishList: msgs
            })

            console.log('--msgs--')
            console.log(msgs)
        })
    }
    

    userDataCard(): React.ReactNode {

        let avatarUrl = 'https://canfish.oss-cn-shanghai.aliyuncs.com/shared/fluentui-emoji/color-svg/target/smiling_face_with_hearts_color.svg'

        if (this.state.userInfo.gender === 1) { // male
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
                {this.state.userInfo.name} {this.state.userInfo.userId}
                <br />
                {this.state.userInfo.deptName}
                <br />
                {this.state.userInfo.currentGrade}级
            </div>
        </div>
    }

    functionEntryGrid(): React.ReactNode {

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

            this.oneTJFunctions.map((entry) => {

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

    messageList(): React.ReactNode {
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '0 auto'
            }}
        > {
            this.state.commonMsgPublishList.map(msg => {
                return <div
                    className='msg-card'
                    onClick={() => {
                        let id = msg.id
                        let destPath = '/msg-publish-show?msgid='.concat(id.toString())
                        this.setState({
                            onNavigateTo: true,
                            navigateToDestination: destPath
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

    override render(): React.ReactNode {

        if (this.state.onNavigateTo) {
            return <Navigate to={ this.state.navigateToDestination } />
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

                { this.userDataCard() }

                <div style={{ height: 24 }} />
                
                { this.state.termInfo.simpleName } 第{ this.state.termInfo.schoolWeek }周
            </div>

            <div style={{ height: 24, flexShrink: 0 }} />

            { /* 功能与通知区域。 */ }
            <div
                className='overflow-y-overlay'
                style={{ flexGrow: 1 }}
            >

                { /* 功能入口。 */ }
                { this.functionEntryGrid() }
            
                { /* 通知入口。 */ }
                { this.messageList() }

                <div style={{ height: 12 }} />
            </div>

        </div>
    }

}
