/*
 * 2051565 GTY
 * 创建于2024年1月7日 广东省珠海市
 */

import React, { useState } from "react";
import { useConstructor } from "../../../../utils/react-functional-helpers";
import PageRouteManager from "../../../../common/PageRoutes";
import { loadPageToLayoutFrame, setLayoutFrameTitle } from "../../../../components/LayoutFrame/LayoutFrame";
import TJApi from "../../../../utils/TJApi";
import HttpUrlUtils from "../../../../utils/HttpUrlUtils";

import '../../../../index.css'
import { Spin } from "antd";
import Random from "../../../../utils/Random";
import FluentUIEmojiProxy from "../../../../utils/FluentUIEmojiProxy";
import { FreeKeyObject } from "../../../../utils/FreeKeyObject";
import { InfoCardBuilder } from "../../../../components/InfoCard/InfoCard";
import { later } from "../../../../utils/later";

interface StuTimetableTermCompletePageState {
    loading: boolean
    courseDataList: FreeKeyObject[]
}

const getCourseIcon = () => {
    const arr = [
        "green_apple", "red_apple", "pear", "tangerine", "lemon",
        "watermelon", "grapes", "strawberry", "blueberries",
        "melon", "cherries", "peach", "pineapple", "kiwi_fruit", "avocado",
        "coconut", "banana", "eggplant", "carrot",
        "bell_pepper", "olive", "onion"
    ]

    let randName = Random.randElement(arr)
    return FluentUIEmojiProxy.colorSvg(randName.concat('_color'))
}

export default function StuTimetableTermCompletePage() {
    const pageEntity = PageRouteManager.getRouteEntity(
        'func/student-timetable/term-complete'
    )

    const [state, setState] = useState<StuTimetableTermCompletePageState>({
        loading: true,
        courseDataList: []
    })

    useConstructor(onConstruct)
    function onConstruct() {
        
        loadPageToLayoutFrame(pageEntity)
        loadData()    
        
        setLayoutFrameTitle(
            '总课表：' 
            + HttpUrlUtils.getUrlData().args.get('termName')!
        )
    }

    function loadData() {
        TJApi.instance().getOneTongjiStudentTimetable().then(res => {
            state.courseDataList = res
        }).catch(err => {   
            // do nothing.
        }).finally(() => {
            state.loading = false
            setState({...state})
        })
    }

    function getRoomName(obj: any): string {
        let res = obj.roomLable
        if (res === '' || res === null || res === undefined) {
            res = obj.classRoomI18n
        }

        if (res === null || res === undefined) {
            res = ''
        }

        return res
    }

    function courseCardList(): React.ReactNode {
        return <div
            style={{
                
            }}
        >
            {
                state.courseDataList.map(it => {
                    let card = InfoCardBuilder.new()
                    console.log(it)
                    
                    card.setTitle(it.courseName)
                        .addInfo('课号', it.classCode)
                        .addInfo('教师', it.teacherName)
                        .addInfo('学分', it.credits)
                        .addInfo('地点', getRoomName(it))
                        .addInfo('时间', it.classTime)
                        .setTopMargin(12)
                        .setLeftMargin(12)
                        .setRightMargin(12)
                        .setIconUrl(getCourseIcon())
                    
                    return card.build()
                })
            }

        </div>
    }


    /* render */

    return <div
        style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
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

        { courseCardList() }
    </div>
}
