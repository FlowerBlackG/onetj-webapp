/*
 * 2051565 GTY
 * 创建于2024年1月11日 海南省三亚市
 */

import { useState } from "react";
import PageRouteManager from "../../../../common/PageRoutes";
import { useConstructor } from "../../../../utils/react-functional-helpers";
import { loadPageToLayoutFrame } from "../../../../components/LayoutFrame/LayoutFrame";

import '../../../../index.css'
import { Button, Spin, message } from "antd";
import FluentUIEmojiProxy from "../../../../utils/FluentUIEmojiProxy";
import { InfoCardBuilder } from "../../../../components/InfoCard/InfoCard";
import TJApi from "../../../../utils/TJApi";
import { useSearchParams } from "react-router-dom";

interface StuTimetableSingleDayPageState {
    loading: boolean

    /** 当前正在查看的是哪一天的。 */
    viewing: {
        /** 周号。 */
        weekNum: number
        
        /** 星期几。0 表示星期日；6 表示星期六。 */
        weekDay: number 

        courses: CourseData[]
    }
}

interface CourseData {
    code: string // 课号
    name: string // 课程名
    teacherName: string
    teacherId: string
    place: string // 上课地点
    timeStart: number
    timeEnd: number
    weeks: number[]
    dayOfWeek: number
}

const courses = [] as CourseData[]
let termWeek = 1 // 当前周号

export default function StuTimetableSingleDayPage() {

    const pageEntity = PageRouteManager.getRouteEntity(
        'func/student-timetable/single-day'
    )

    const [searchParams, setSearchParams] = useSearchParams()

    const [state, setState] = useState<StuTimetableSingleDayPageState>({
        loading: true,
        viewing: {
            weekNum: 1,
            weekDay: 1,
            courses: []
        }
    })

    useConstructor(constructor)
    function constructor() {
        termWeek = Number(searchParams.get('termWeek'))
        loadPageToLayoutFrame(pageEntity)
        loadData()
    }

    function getCourseRoom(obj: any) {
        let res = obj.roomIdI18n
        if (res === null || res === undefined || res.length === 0) {
            res = obj.roomLable
        }

        if (res === null || res === undefined || res.length === 0) {
            res = obj.roomLabel
        }

        return res
    }

    function loadData() {
        TJApi.instance().getOneTongjiStudentTimetable().then(res => {

            courses.length = 0 // 删掉原来有的数据。

            res.forEach(basicData => {
                let timeTableList = basicData.timeTableList as any[]
                timeTableList.forEach(detailedData => {
                    
                    
                    courses.push({
                        code: detailedData.classCode,
                        name: detailedData.courseName,
                        teacherName: detailedData.teacherName,
                        teacherId: detailedData.teacherCode,
                        place: getCourseRoom(detailedData),
                        timeStart: detailedData.timeStart,
                        timeEnd: detailedData.timeEnd,
                        weeks: detailedData.weeks,
                        dayOfWeek: detailedData.dayOfWeek
                    })
                })
            })

            viewToday()
        }).catch(err => {

        }).finally(() => {
            state.loading = false
            setState({...state})
        })
    }

    function setViewing(weekNum: number, weekDay: number) {
        let viewCourses = courses.filter(it => {
            return it.dayOfWeek === weekDay
                && it.weeks.includes(weekNum)
        })

        viewCourses.sort((a, b) => {
            return a.timeStart - b.timeStart
        })

        state.viewing = {
            weekNum: weekNum,
            weekDay: weekDay,
            courses: viewCourses
        }

        setState({...state})
    }

    function getCourseIcon(timeStart: number) {
        if (timeStart <= 2) {
            return FluentUIEmojiProxy.colorSvg('bread_color')
        } else if (timeStart <= 4) {
            return FluentUIEmojiProxy.colorSvg('curry_rice_color')
        } else if (timeStart <= 6) {
            return FluentUIEmojiProxy.colorSvg('tropical_drink_color')
        } else if (timeStart <= 9) {
            return FluentUIEmojiProxy.colorSvg('hamburger_color')
        } else {
            return FluentUIEmojiProxy.colorSvg('moon_cake_color')
        }
    }

    function viewToday() {
        setViewing(termWeek, (new Date()).getDay())
    }

    function viewAjacentDay(offset: 1 | -1) {
        let weekNum = state.viewing.weekNum
        let weekDay = state.viewing.weekDay
        weekDay += offset
        
        if (weekDay === 7) { // 显然有 offset = 1
            // 周六的下一天是本周周日
            weekDay = 0
        } else if (weekDay === 1 && offset === 1) {
            // 周日的下一天是下周一
            weekNum++
        } else if (weekDay === 0 && offset === -1) {
            // 周一的前一天是上周日
            weekNum--
        } else if (weekDay === -1) { // 显然有 offset = -1
            // 周日的前一天是本周六
            weekDay = 6
        }

        if (weekNum <= 0 || weekNum > 21) {
            message.warning('再点就超范围了凹~')
            return
        }

        setViewing(weekNum, weekDay)
    }

    const weekDayCh = ["日", "一", "二", "三", "四", "五", "六"]

    function weekDayTitle() {
        return <div
            style={{
                flexShrink: 0,
                display: 'grid',
                gridTemplateColumns: '49% 49%',
                width: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                fontSize: 24
            }}
        >
            <div>
                第{state.viewing.weekNum}周
            </div>

            <div>
                星期{weekDayCh[state.viewing.weekDay]}
            </div>

        </div>
    }

    function curriculums() {
        return <div
            style={{
                flexShrink: 0,
                flexGrow: 1
            }}
            className="overflow-y-overlay"
        >
            { 
                state.viewing.courses.map(it => {
                    let card = InfoCardBuilder.new()

                    card.setTitle(it.name)
                        .addInfo('地点', it.place)
                        .addInfo('课号', it.code)
                        .addInfo('教师', it.teacherName)
                        .setIconUrl(getCourseIcon(it.timeStart))
                        .setFootNote(
                            it.timeStart.toString()
                                .concat('-')
                                .concat(it.timeEnd.toString())
                        )

                    return card.build()
                })
            }
        </div>
    }

    function actionKeys() {

        let buttonStyle: React.CSSProperties = {
            fontSize: 18,
            height: 56
        }

        return <div
            style={{
                flexShrink: 0,
                display: 'grid',
                gridTemplateColumns: '30% 30% 30%',
                justifyContent: 'center',
                width: '100%',
                columnGap: 12
            }}
        >
            <Button 
                style={buttonStyle}
                shape='round'
                onClick={() => viewAjacentDay(-1)}
            >
                前一天
            </Button>

            <Button 
                style={buttonStyle}
                shape='round'  
                onClick={viewToday}
            >
                今天
            </Button>

            <Button 
                style={buttonStyle}
                shape='round'
                onClick={() => viewAjacentDay(1)}
            >
                后一天
            </Button>
        </div>
    }


    /* render */

    return <div
        style={{
            position: 'relative',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: 12,
            userSelect: 'none'
        }}
    >

        <Spin
            spinning={state.loading}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        />

        { weekDayTitle() } 
        <div style={{ height: 12 }} />
        { curriculums() }
        <div style={{ height: 12 }} />
        { actionKeys() }
    </div>

}

