/*
 * 2051565 GTY
 * 创建于2024年1月8日 广东省湛江市
 */

import { ReactNode, useState } from 'react'
import PageRouteManager from '../../../common/PageRoutes'
import '../../../index.css'
import { Spin } from 'antd'
import { useConstructor } from '../../../utils/react-functional-helpers'
import { loadPageToLayoutFrame } from '../../../components/LayoutFrame/LayoutFrame'
import TJApi from '../../../utils/TJApi'
import FluentUIEmojiProxy from '../../../utils/FluentUIEmojiProxy'
import { InfoCardBuilder } from '../../../components/InfoCard/InfoCard'

interface MyGradesPageState {
    loading: boolean
    gradeData: any
}

export default function MyGradesPage() {

    const pageEntity = PageRouteManager.getRouteEntity('func/my-grades')

    const [state, setState] = useState<MyGradesPageState>({
        loading: true,
        gradeData: {}
    })

    useConstructor(onConstruct)
    function onConstruct() {
        loadPageToLayoutFrame(pageEntity)
        loadData()
    }

    function loadData() {
        TJApi.instance().getOneTongjiUndergraduateScore().then(res => {
            state.gradeData = res
        }).catch(err => {
            // do nothing.
        }).finally(() => {
            state.loading = false
            setState({...state})
        })
    }

    function basicGradeInfo(): ReactNode {
        let infoCards = [] as ReactNode[]

        function addInfo(title: string, value: any, floatPrecision: number) {

            let realValue = value
            try {
                realValue = Number(value)
                realValue = (realValue as number).toFixed(floatPrecision)
            } catch (e: any) {}

            let card = <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    marginTop: 16
                }}
            >
                <div style={{ fontSize: 24 }}> { realValue } </div>
                <div style={{ fontSize: 20, marginTop: 4 }}> { title } </div>
            </div>

            infoCards.push(card)
        }

        addInfo('总均绩点', state.gradeData.totalGradePoint, 2)
        addInfo('总修学分', state.gradeData.actualCredit, 2)
        addInfo('失利学分', state.gradeData.failingCredits, 2)
        addInfo('失利门数', state.gradeData.failingCourseCount, 0)

        return <div
            style={{
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                width: '100%',
                justifyItems: 'center'
            }}
        >
            { infoCards }
        </div>
    }

    function singleTermInfo(data: any): ReactNode {
        function gradePoint2GradeEngChAndIcon(point: number): [string, string] {
            if (point === 5) {
                return ['A', FluentUIEmojiProxy.colorSvg('strawberry_color')]
            } else if (point === 4) {
                return ['B', FluentUIEmojiProxy.colorSvg('cherries_color')]
            } else if (point === 3) {
                return ['C', FluentUIEmojiProxy.colorSvg('tangerine_color')]
            } else if (point === 2) {
                return ['D', FluentUIEmojiProxy.colorSvg('lemon_color')]
            } else {
                return ['E', FluentUIEmojiProxy.colorSvg('grapes_color')]
            }
        }

        return <div
            style={{

            }}
        >
            { /* 学期信息。 */ }

            <div
                style={{
                    borderRadius: 16,
                    border: '1px solid #7777',
                    boxSizing: 'border-box',
                    padding: 18,
                    fontSize: 22,
                    marginTop: 32,
                    textAlign: 'center'
                }}
            >
                { data.termName }
            </div>

            <div
                style={{
                    fontSize: 22,
                    marginTop: 24,
                    boxSizing: 'border-box',
                    padding: 16,
                    textAlign: 'center'
                }}
            >
                平均绩点：{ data.averagePoint }
            </div>

            { /* 成绩卡片。 */ }

            {
                data.creditInfo.map((it: any) => {
                    let card = InfoCardBuilder.new()
                    console.log(it)
            
                    let [gradeEngCh, gradeIcon] = gradePoint2GradeEngChAndIcon(it.gradePoint)
            
                    card.setIconUrl(gradeIcon)
                        .setTitle(it.courseName)
                        .addInfo('课号', it.courseCode)
                        .addInfo('学分', it.credit)
                        .addInfo('更新', it.updateTime)
                        .setFootNote(gradeEngCh)
                        .setHasBorder(false)
                        .setTopMargin(16)

                    return card.build()
                })
            }
        </div>

    }

    function allTermGradeInfo(): ReactNode {

        console.log(state.gradeData)
        let term = state.gradeData.term
        if (term === null || term === undefined) {
            return [''] // 还没有过成绩。
        }

        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}
        > 
            { term.map(singleTermInfo) }
        </div>
    }

    function gradeData(): React.ReactNode {
        return <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
                marginRight: 12
            }}
        >
            { basicGradeInfo() }
            { allTermGradeInfo() }
        </div>
    }


    /* render */

    return <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
        }}
        className="overflow-y-overlay"
    >
        <Spin
            spinning={state.loading}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        />

        { state.loading ? '' : gradeData() }

        <div style={{ height: 8 }} />
    </div>
}
