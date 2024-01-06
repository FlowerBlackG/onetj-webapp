/*
 * 2051565 GTY
 * 创建于2024年1月6日 湖南省衡阳市（高铁线）
 */

import React from "react";
import PageRouteManager from "../../../common/PageRoutes";
import { later } from "../../../utils/later";
import { loadPageToLayoutFrame } from "../../../components/LayoutFrame/LayoutFrame";
import { Spin } from "antd";
import TJApi from "../../../utils/TJApi";
import { InfoCardBuilder } from "../../../components/InfoCard/InfoCard";
import FluentUIEmojiProxy from "../../../utils/FluentUIEmojiProxy";

interface CetScorePageState {
    loading: boolean

    cetScoreList: CetScoreData[]
}

interface CetScoreData {
    isCet4: boolean
    termName: string
    score: string
    cardNo: string // 准考证号
    writtenSubjectName: string
    oralScore: string
    stuId: string
    stuName: string
}

export default class CetScorePage extends React.Component<
    any, CetScorePageState
> {

    state: CetScorePageState = {
        loading: true,
        cetScoreList: []
    }

    pageEntity = PageRouteManager.getRouteEntity('func/cet-score')

    constructor(props: any) {
        super(props)

        later(() => {
            loadPageToLayoutFrame(this.pageEntity)
            this.loadData()
        })
    }

    loadData() {
        TJApi.instance().getOneTongjiCetScore().then(res => {
            let scoreList = [] as CetScoreData[]
            for (let score of res) {
                scoreList.push({
                    isCet4: score.cetType == '1',
                    termName: score.calendarYearTermCn,
                    score: score.score,
                    cardNo: score.cardNo,
                    writtenSubjectName: score.writtenSubjectName,
                    oralScore: score.oralScore == null ? '无' : score.oralScore,
                    stuId: score.studentId,
                    stuName: score.studentName
                })
            }

            this.setState({
                cetScoreList: scoreList,
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }

    cetScoreCardList(): React.ReactNode {
        return <div>
            {
                this.state.cetScoreList.map(score => {
                    let card = InfoCardBuilder.new()

                    card.setIconUrl(
                        score.isCet4 ?
                            FluentUIEmojiProxy.colorSvg('thinking_face_color')
                            :
                            FluentUIEmojiProxy.colorSvg('exploding_head_color')
                    )

                    card.addInfo('准考证', score.cardNo)
                        .addInfo('学生', score.stuId.concat(' ').concat(score.stuName))
                        .addInfo('科目', score.writtenSubjectName)
                        .addInfo('口试', score.oralScore)
                        .setLeftMargin(12)
                        .setRightMargin(12)
                        .setTopMargin(12)
                        .setFootNote(
                            Number(score.score)
                                .toFixed()
                        )

                    return card.build()
                })
            }
        </div>
    }

    override render(): React.ReactNode {
        return <div
            className="overflow-y-overlay"
            style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
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

            {
                this.cetScoreCardList()
            }

        </div>
    }
}
