/*
 * 2051565 GTY
 * 创建于2024年1月6日 广东省广州市（高铁线）
 */

import React from 'react';
import '../../../index.css'
import PageRouteManager from '../../../common/PageRoutes';
import { later } from '../../../utils/later';
import { loadPageToLayoutFrame } from '../../../components/LayoutFrame/LayoutFrame';
import TJApi from '../../../utils/TJApi';
import { Spin } from 'antd';
import { InfoCardBuilder } from '../../../components/InfoCard/InfoCard';
import FluentUIEmojiProxy from '../../../utils/FluentUIEmojiProxy';

interface StuExamEnquiriesPageState {
    loading: boolean
    examDataList: ExamData[]
    calendarName: string
}

interface ExamData {
    roomName: string
    examSituation: string
    courseName: string
    courseCode: string
    examTime: string
    remark: string
}

const getExamDataSortKey = (x: ExamData): string => {
    if (x.examSituation == '1' || x.roomName !== null) {
        return x.examTime
    } else {
        return '9'
    }
}

export default class StuExamEnquiriesPage extends React.Component<
    any, StuExamEnquiriesPageState
> {

    state: StuExamEnquiriesPageState = {
        loading: true,
        examDataList: [],
        calendarName: '学期...'
    }

    pageEntity = PageRouteManager.getRouteEntity('func/stu-exam-enquiries')
    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
            this.loadData()
        })
    }

    loadData() {
        TJApi.instance().getOneTongjiStudentExams().then(res => {

            let dataList = res
            let examList = [] as ExamData[]
            for (let it of dataList) {

                let data: ExamData = {
                    roomName: it.roomName,
                    examSituation: it.examSituation,
                    courseName: it.courseName,
                    courseCode: it.courseCode,
                    examTime: it.examTime,
                    remark: it.remark
                }

                examList.push(data)
            }

            examList.sort((a, b) => {

                return getExamDataSortKey(a) < getExamDataSortKey(b) ? -1 : 1
            })

            this.setState({
                examDataList: examList,
                loading: false,
                calendarName: dataList[0].calendar
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }

    examInfoCardList(): React.ReactNode {
        return <div>
            {
                this.state.examDataList.map((data) => {

                    let card = InfoCardBuilder.new()

                    card.setTopMargin(12)
                        .setLeftMargin(12)
                        .setRightMargin(12)
                        .setTitle(data.courseName)
                        .addInfo('课号', data.courseCode)

                    if (data.examSituation == '1' || data.roomName !== null) {
                        card.addInfo('地点', data.roomName)
                            .addInfo('时间', data.examTime)
                            .setIconUrl(FluentUIEmojiProxy.colorSvg('black_nib_color'))
                    } else {
                        card.setIconUrl(FluentUIEmojiProxy.colorSvg('desktop_computer_color'))
                    }

                    card.addInfo('备注', data.remark)

                    return card.build()
                })
            }
        </div>
    }

    override render(): React.ReactNode {
        return <div
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
            }}
        >

            <Spin
                spinning={ this.state.loading }
                style={{
                    position: "absolute",
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    
                }}
            />

            <div
                style={{
                    textAlign: 'center',
                    marginTop: 16,
                    fontSize: 22
                }}
            >

                { this.state.calendarName }

            </div>

            <div style={{ height: 8 }} />

            { this.examInfoCardList() }

        </div>
    }

}
