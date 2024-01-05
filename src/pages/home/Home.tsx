/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import React from 'react';
import './Home.css'
import { pageRouteEntityMap } from '../../common/PageRoutes';
import { later } from '../../utils/later';
import { loadPageToLayoutFrame } from '../../components/LayoutFrame/LayoutFrame';
import TJApi, { TJApiOneTongjiSchoolCalendar, TJApiStudentInfo } from '../../utils/TJApi';

interface HomePageState {
    userInfo: TJApiStudentInfo
    termInfo: TJApiOneTongjiSchoolCalendar
}

export default class HomePage extends React.Component<
    any, HomePageState
> {

    pageEntity = pageRouteEntityMap['home']

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
            schoolWeek: '',
            simpleName: '...'
        }
    }

    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
            this.loadUserBasicData()
            this.loadTermBasicInfo()
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
                flexShrink: 0
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
                    textAlign: 'left'
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

    override render(): React.ReactNode {
        return <div className='container'>

            <div
                style={{
                    fontSize: 24,
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                <div style={{ height: 24 }} />

                { this.userDataCard() }

                <div style={{ height: 24 }} />
                
                { this.state.termInfo.simpleName }
            </div>


        </div>
    }

}
