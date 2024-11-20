/*
 * 2051565 GTY
 * 创建于2024年1月15日 海南省海口市
 */

import { useState } from 'react'
import PageRouteManager from '../../../common/PageRoutes'
import '../../../index.css'
import { loadPageToLayoutFrame } from '../../../components/LayoutFrame/LayoutFrame'
import { useConstructor } from '../../../utils/react-functional-helpers'
import { Spin } from 'antd'
import TJApi from '../../../utils/TJApi'

interface SportsTestDataPageState {
    loading: {
        sports: boolean
        health: boolean
    }

    sportsData: {
        updateTime: string
        runCount: string
        gymCount: string

    }

    healthData: {
        userId: string
        sexName: string
        name: string
        remarks: string

        firstScore: string
        secondScore: string
        thirdScore: string
        fourthScore: string

        avgScore: string

        thisTerm: {
            height: [string, string]
            weight: string
            enduranceRunning: [string, string]
            fiftyMeters: string
            sitUpOrPullUp: string
            standingLongJump: string
            sitForward: string
            vitalCapacity: string
        }
    }
}

export default function SportsTestDataPage() {
    const pageEntity = PageRouteManager.getRouteEntity('func/sports-test-data')

    const [state, setState] = useState<SportsTestDataPageState>({
        loading: {
            sports: true,
            health: true
        },

        sportsData: {
            updateTime: '...',
            runCount: '...',
            gymCount: '...'
        },
        
        healthData: {
            userId: '...',
            sexName: '...',
            name: '...',
            remarks: '...',

            firstScore: '...',
            secondScore: '...',
            thirdScore: '...',
            fourthScore: '...',

            avgScore: '...',

            thisTerm: {
                height: ['...', '...'],
                weight: '...',
                enduranceRunning: ['...', '...'],
                fiftyMeters: '...',
                sitUpOrPullUp: '...',
                standingLongJump: '...',
                sitForward: '...',
                vitalCapacity: '...'
            }
        }
    })

    useConstructor(constructor)
    function constructor() {
        loadPageToLayoutFrame(pageEntity)
        loadData()
    }

    function loadData() {
        loadSportsData()
        loadSportsHealthData()
    }

    function loadSportsData() {
        TJApi.instance().getTeachingSportsTestData().then(res => {

            state.sportsData = {
                updateTime: String(res.updateTime),
                gymCount: String(res.stSport),
                runCount: String(res.stRun)
            }

        }).catch(err => {

        }).finally(() => {
            state.loading.sports = false
            setState({...state})
        })
    }

    function loadSportsHealthData() {
        
        TJApi.instance().getTeachingSportsTestHealthData().then(res => {

            let height = ((Number(res.height) + 0.01) / 100).toFixed(2)
            let heightSegments = height.split('.') as [string, string]

            let sitUpOrPullUp = res.sexName === '女'
                ? String(res.sitUp) : String(res.pullUp)

            let enduranceRun = Number(res.enduranceRunning).toFixed(2)
                .split('.') as [string, string]

            state.healthData = {
                userId: String(res.userId),
                sexName: String(res.sexName),
                remarks: String(res.remarks),
                name: String(res.name),

                firstScore: String(res.firstScore),
                secondScore: String(res.secondScore),
                thirdScore: String(res.thirdScore),
                fourthScore: String(res.fourthScore),

                avgScore: String(res.avgScore),

                thisTerm: {
                    height: heightSegments,
                    weight: String(res.weight),
                    enduranceRunning: enduranceRun,
                    fiftyMeters: String(res.fiftyMeters),
                    sitUpOrPullUp: sitUpOrPullUp,
                    standingLongJump: String(Number(res.standingLongJump) / 100),
                    sitForward: String(res.sitForward),
                    vitalCapacity: String(res.vitalCapacity)
                }
            }
            
        }).catch(err => {

        }).finally(() => {
            state.loading.health = false
            setState({...state})
        })
    }

    function generalHealthData() {
        
        let data = [
            {
                year: '大一',
                score: state.healthData.firstScore
            },
            {
                year: '大二',
                score: state.healthData.secondScore
            },
            {
                year: '大三',
                score: state.healthData.thirdScore
            },
            {
                year: '大四',
                score: state.healthData.fourthScore
            },
        ]

        return <div
            style={{
                flexShrink: 0
            }}
        >
            <div
                style={{
                    fontSize: 24
                }}
            >
                整体体测成绩
            </div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '25% 25% 25% 25%',
                    marginTop: 16
                }}
            >
                { 
                    data.map(it => {
                        return <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #7777',
                                borderRadius: 8,
                                marginLeft: 4,
                                marginRight: 4,
                                padding: 8,
                            }}
                        >
                            <div>{ it.year }</div>
                            <div style={{ height: 4 }} />
                            <div
                                style={{
                                    fontSize: 20
                                }}
                            >
                                { it.score }
                            </div>
                        </div>
                    }) 
                }
            </div>

            <div
                style={{
                    boxSizing: 'border-box',
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'row',
                    border: '1px solid #7777',
                    borderRadius: 8,
                    marginTop: 8,
                    marginLeft: 4,
                    marginRight: 4,
                    alignItems: 'center',
                    textAlign: 'left'
                }}
            >
                <div
                    style={{
                        flexGrow: 1,
                        flexShrink: 0,
                        marginLeft: 12
                    }}
                >
                    总平均成绩
                </div>

                <div
                    style={{
                        flexShrink: 0,
                        fontSize: 20,
                        marginRight: 12
                    }}
                >
                    { state.healthData.avgScore }
                </div>
            </div>
        </div>
    }


    function thisTermHeahthData() {

        let data = [] as { key: string, value: string }[]

        data.push({
            key: '身高',
            value: state.healthData.thisTerm.height[0]
                .concat(' 米 ').concat(state.healthData.thisTerm.height[1])
        })
        data.push({
            key: '体重',
            value: state.healthData.thisTerm.weight
                .concat(' 千克')
        })
        data.push({
            key: '长跑',
            value: state.healthData.thisTerm.enduranceRunning[0]
                .concat(' 分')
                .concat(state.healthData.thisTerm.enduranceRunning[1])
                .concat(' 秒')
        })
        
        data.push({
            key: '50米',
            value: state.healthData.thisTerm.fiftyMeters
                .concat(' 秒')
        })
        data.push({
            key: state.healthData.sexName === '女' ? '仰卧起坐' : '引体向上',
            value: state.healthData.thisTerm.sitUpOrPullUp
                .concat(' 个')
        })

        data.push({
            key: '立定跳远',
            value: state.healthData.thisTerm.standingLongJump
                .concat(' 米')
        })
        data.push({
            key: '体前屈',
            value: state.healthData.thisTerm.sitForward
                .concat(' 厘米')
        })
        data.push({
            key: '肺活量',
            value: state.healthData.thisTerm.vitalCapacity
                .concat(' 毫升')
        })
        

        return <div
            style={{
                flexShrink: 0
            }}
        >
            <div
                style={{
                    fontSize: 24
                }}
            >
                本学年体测成绩
            </div>

            <div
                style={{
                    boxSizing: 'border-box',
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 4,
                    paddingBottom: 4,
                    border: '1px solid #7777',
                    borderRadius: 8,
                    marginTop: 16,
                    marginLeft: 4,
                    marginRight: 4,
                    textAlign: 'left'
                }}
            >
                {
                    data.map(it => {
                        return <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: 12,
                                marginBottom: 12,
                                alignItems: 'center'
                            }}
                        >
                            <div
                                style={{
                                    flexShrink: 0,
                                    flexGrow: 1,
                                    marginLeft: 12
                                }}
                            >
                                { it.key }
                            </div>


                            <div
                                style={{
                                    flexShrink: 0,
                                    fontSize: 18,
                                    marginRight: 12
                                }}
                            >
                                { it.value }
                            </div>
                        </div>
                    })
                }

            </div>
        </div>
    }


    /* render */

    let userNameStr = state.healthData.userId 
    userNameStr += ' '.concat(state.healthData.name)
    userNameStr += ' ('
    userNameStr += state.healthData.sexName
    userNameStr += ')'

    // gym 和 run 次数
    let bigCardData = [
        {
            key: '健身跑步',
            value: state.sportsData.runCount
        },
        {
            key: '场馆锻炼',
            value: state.sportsData.gymCount
        }
    ]

    return <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            boxSizing: 'border-box',
            padding: 8
        }}
        className='overflow-y-overlay'
    >
        <Spin
            spinning={
                state.loading.health || state.loading.sports
            }
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        />

        <div
            style={{
                fontSize: 24,
                marginTop: 12,
                flexShrink: 0
            }}
        >
            本学期体锻
        </div>

        { /* 学生姓名 */ }
        <div
            style={{
                marginTop: 8,
                flexShrink: 0
            }}
        >
            { userNameStr }
        </div>

        { /* 更新时间 */ }
        <div
            style={{
                marginTop: 4,
                flexShrink: 0
            }}
        >
            更新时间：{ state.sportsData.updateTime }
        </div>

        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                marginTop: 16,
                flexShrink: 0
            }}
        >
            {
                bigCardData.map(it => {
                    return <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #7777',
                            borderRadius: 8,
                            marginLeft: 4,
                            marginRight: 4,
                            padding: 16,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 18
                            }}
                        >
                            {it.key}
                        </div>
                        <div style={{ height: 10 }} />
                        <div
                            style={{
                                fontSize: 24
                            }}
                        >
                            {it.value}
                        </div>
                    </div>
                })
            }
        </div>

        <div style={{ height: 24, flexShrink: 0 }} />
    
        { generalHealthData() }

        <div style={{ height: 24, flexShrink: 0 }} />

        { thisTermHeahthData() }

        { /* 底部备注 */ }
        <div
            style={{
                marginTop: 16,
                flexShrink: 0
            }}
        >
            { state.healthData.remarks }
        </div>

        <div style={{ height: 16, flexShrink: 0 }} />

    </div>
}
