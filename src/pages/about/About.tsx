/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */


import React from 'react'
import Version from '../../common/Version'
import DateTimeUtils from '../../utils/DateTimeUtils'
import './About.css'
import { globalData } from '../../common/GlobalData'
import { later } from '../../utils/later'
import { request } from '../../utils/request'
import { loadPageToLayoutFrame } from '../../components/LayoutFrame/LayoutFrame'
import TJApi from '../../utils/TJApi'
import PageRouteManager from '../../common/PageRoutes'

interface AboutPageState {
    [key: string]: any
}

export default class AboutPage extends React.Component<
    any, AboutPageState
> {
    pageEntity = PageRouteManager.getRouteEntity('about')

    state: AboutPageState = {
        appVersionName: Version.tag,
        appVersionCode: Version.code,
        appBuildtime: DateTimeUtils.iso8601toHumanFriendly(Version.buildTime),

        dataLoading: false
    }

    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
        })

    }

    override render(): React.ReactNode {
        return <div className='container overflow-y-overlay'>
            <img
                src='https://canfish.oss-cn-shanghai.aliyuncs.com/app/onetj-webapp/logo.jpg'
                className='onetj-logo'
            />

            <div className='title'>OneTJ React WebApp</div>

            <div
                style={{
                    marginTop: 24,
                    textAlign: 'center',
                    fontSize: 20
                }}
            >
                <div>
                       
                    { this.state.appVersionName } ({this.state.appVersionCode})
                </div>

                <div>
                    {
                        this.state.appBuildtime
                    }
                </div>

                <br />

                <div>在同济信息办的指导下开发</div>

            </div>


            <div
                className='button-highlight'
                style={{
                    marginTop: 36
                }}

                onClick={() => {
                    const w = window.open('https://github.com/FlowerBlackG/onetj-webapp')
                   
                }}
            >
                获取源代码
            </div>

            <div
                className='button-highlight'
                style={{
                    marginTop: 24
                }}
                onClick={() => {
                    const w = window.open('https://guotuan.gardilily.com/guo-common/opensource-licenses.php')
                }}
            >
                开源许可证
            </div>


            <div style={{ height: 16, flexShrink: 0 }} />

            <div style={{
                textAlign: 'center',
                position: 'absolute',
                bottom: 16,
                fontSize: 12
            }}>
                Based on the Tongji Open Platform APIs
                <br />
                Developed by GTY
            </div>
        </div>
    }
}
