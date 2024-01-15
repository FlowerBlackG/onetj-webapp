/*
 * 同济开放平台接口封装。
 *
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

import { AxiosRequestConfig, AxiosResponse } from "axios"
import HttpUrlUtils from "./HttpUrlUtils"
import { request } from "./request"
import FormData from "form-data"
import { Modal, message, notification } from "antd"
import DataStore from "./DataStore"
import { FreeKeyObject } from "./FreeKeyObject"

interface TJApiTokenData {
    token: string
    expireTimeSec: number
    refreshToken: string
    refreshTokenExpireSec: number
}

export interface TJApiStudentInfo {
    userId: String
    name: String
    gender: number
    deptName: String
    secondDeptName: String
    schoolName: String
    currentGrade: String
}

export interface TJApiOneTongjiSchoolCalendar {
    calendarId: string
    year: string
    term: string
    schoolWeek: string
    simpleName: string
}

enum TJApiFailCriticalLevel {
    Critical,
    Warning
}

export default class TJApi {
    protected static _instance: TJApi

    protected constructor() {}

    public static getInstance(): TJApi {
        if (!TJApi._instance) {
            TJApi._instance = new TJApi()
        }

        return TJApi._instance
    }

    public static instance(): TJApi {
        return TJApi.getInstance()
    }

    static CLIENT_ID = "authorization-xxb-onedottongji-yuchen"
    static BASE_URL = "https://api.tongji.edu.cn"
    
    static getOAuthRedirectUrl(encodeHashMark: boolean = true): string {
        let urlObj = new URL(window.location.href)

        let res = urlObj.origin.concat(urlObj.pathname)
        
        res += (encodeHashMark ? '%23' : '#') // "%23" 即 "#"
        res += '/tongji-oauth'

        return res
    }

    static CODE2TOKEN_URL = "$BASE_URL/v1/token"

    static SCOPE_LIST = [
        "dc_user_student_info",
        "rt_onetongji_cet_score",
        "rt_onetongji_school_calendar_current_term_calendar",
        "rt_onetongji_undergraduate_score",
        "rt_teaching_info_undergraduate_summarized_grades", // 暂未使用
        "rt_onetongji_student_timetable",
        "rt_onetongji_student_exams",
        "rt_teaching_info_sports_test_data",
        "rt_teaching_info_sports_test_health",
        "rt_onetongji_manual_arrange",
        "rt_onetongji_school_calendar_all_term_calendar",
        "rt_onetongji_msg_list",
        "rt_onetongji_msg_detail",
    ]

    static TOKEN_DATA_STORAGE_KEY = 'tokenData'

 
    /* helpers */


    protected basicRequestParams(url: string, method?: string): AxiosRequestConfig {
        let res: AxiosRequestConfig = {
            url: url,
            headers: {
                Authorization: 'Bearer '.concat(this.getTokenData().token)
            }
        }

        if (method !== undefined) {
            res.method = method
        }

        return res
    }


    /* TJApi 工具基本 */

    public tokenAvailable(): boolean {
        let token = this.getTokenData()
        
        let currTimeMillis = Date.now()
        return token.expireTimeSec > currTimeMillis / 1000 + 10
    }

    public clearCache() {
        if (this.tokenData !== null) {
            this.tokenData.expireTimeSec = 0
            this.tokenData.refreshTokenExpireSec = 0
        }

        DataStore.remove(TJApi.TOKEN_DATA_STORAGE_KEY)
    }

    public storeTokenData(tokenData: TJApiTokenData) {
        DataStore.put(TJApi.TOKEN_DATA_STORAGE_KEY, tokenData)
    }

    public getTokenData(): TJApiTokenData {

        if (this.tokenData !== null) {
            return this.tokenData
        }

        let valueFromStorage = DataStore.get(TJApi.TOKEN_DATA_STORAGE_KEY)
        
        if (valueFromStorage === undefined) {
            return {
                token: '',
                expireTimeSec: 0,
                refreshToken: '',
                refreshTokenExpireSec: 0
            } 
        }

        this.tokenData = valueFromStorage as TJApiTokenData
        return this.tokenData 
    }

    protected tokenData: TJApiTokenData | null = null

    solveError(
        msg: string,
        requestDetailMsg: string,
        criticalLevel: TJApiFailCriticalLevel
    ) {

        notification.error({
            message: requestDetailMsg
        })

        if (criticalLevel === TJApiFailCriticalLevel.Critical) {
            
        } else if (criticalLevel === TJApiFailCriticalLevel.Warning) {

        }
    }

    checkError(
        response: AxiosResponse<any, any>,
        criticalLevel: TJApiFailCriticalLevel = TJApiFailCriticalLevel.Critical
    ): number {

        let data = response.data
        let request = response.request as XMLHttpRequest

        let errMsg = '地址\n'.concat(request.responseURL).concat('\n')
        errMsg += '状态\n'.concat(response.status.toString()).concat('\n')
        errMsg += '信息\n'.concat(response.statusText).concat('\n')

        if (data.error_error !== undefined) {
            this.solveError(data.error_error, errMsg, criticalLevel)
            return -1
        } 
        
        if (data.code !== 'A00000') {
            this.solveError('code is '.concat(data.code), errMsg, criticalLevel)
            return -2
        }

        return 0
    }

    oneTongjiApiProxy(
        apiPath: string,
        method: string = 'get'
    ): Promise<any> {
        return new Promise((resolve, reject) => {

            let req = this.basicRequestParams(
                TJApi.BASE_URL.concat(apiPath), 
                method
            )

            request(req).then(res => {
                if (this.checkError(res) !== 0) {
                    reject(null)
                    return
                }

                let data = res.data.data

                resolve(data)
            }).catch(err => {
                this.solveError(
                    'request err',
                    err.message,
                    TJApiFailCriticalLevel.Warning
                )
                reject(err.message)
            })
        })
    }
    
    /* 开放平台 api 封装 */
    public code2token(code: string): Promise<null> {

        let postBody = new URLSearchParams({})

        postBody.append('grant_type', 'authorization_code')
        postBody.append('client_id', TJApi.CLIENT_ID)
        postBody.append('code', code)
        postBody.append('redirect_uri', TJApi.getOAuthRedirectUrl(false))
        
        return new Promise((resolve, reject) => {
            request({
                url: TJApi.BASE_URL.concat('/v1/token'),
                method: 'POST',
                data: postBody,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(res => {

                let data = res.data

                if (data.access_token === undefined) {
                    // 登录失败。
                    reject('失败。code2token')
                } else {

                    let currTimeSec = Date.now() / 1000

                    this.tokenData = {
                        token: data.access_token,
                        expireTimeSec: data.expires_in + currTimeSec - 10,
                        refreshToken: data.refresh_token,
                        refreshTokenExpireSec: data.refresh_expires_in + currTimeSec - 10
                    }

                    this.storeTokenData(this.tokenData)
                    resolve(null)
                }

                resolve(null)

            }).catch(err => { 
                reject(err.message) 
            })
            
        })
    }

    public getStudentInfo(): Promise<TJApiStudentInfo> {
        return new Promise((resolve, reject) => {
            let req = this.basicRequestParams(
                TJApi.BASE_URL.concat('/v1/dc/user/student_info'),
                'get'
            )

            request(req).then(res => {

                
                if (this.checkError(res) !== 0) {
                    reject(null)
                    return
                }
                
                let data = res.data.data[0]
                
                let resObj: TJApiStudentInfo = {
                    userId: data.userId,
                    name: data.name,
                    gender: Number(data.sexCode),
                    deptName: data.deptName,
                    secondDeptName: data.secondDeptName,
                    schoolName: data.schoolName,
                    currentGrade: data.currentGrade
                }
                
                resolve(resObj)
                

            }).catch(err => {
                this.solveError(
                    'request err',
                    err.message,
                    TJApiFailCriticalLevel.Warning
                )

                reject(err.message)
            })
        })
    }

    getOneTongjiSchoolCalendar(): Promise<TJApiOneTongjiSchoolCalendar> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/school_calendar_current_term_calendar'
            ).then(res => {
                let resObj: TJApiOneTongjiSchoolCalendar = {
                    calendarId: res.schoolCalendar.id,
                    year: '',
                    term: '',
                    schoolWeek: res.week,
                    simpleName: res.simpleName
                }
                resolve(resObj)
            }).catch(err => reject)
        })
    }

    getOneTongjiUndergraduateScore(): Promise<FreeKeyObject> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/undergraduate_score?calendarId=-1'
            ).then(res => {
                resolve(res)
            }).catch(err => reject)
        })
    }

    getOneTongjiStudentTimetable(): Promise<FreeKeyObject[]> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/student_timetable'
            ).then(res => {
                resolve(res)
            }).catch(err => reject)
        })
    }

    getOneTongjiStudentExams(): Promise<FreeKeyObject[]> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/student_exams'
            ).then(res => {
                
                resolve(res.list)
            }).catch(err => reject)
        })
    }

    getOneTongjiCetScore(): Promise<FreeKeyObject[]> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/cet_score'
            ).then(res => {
                resolve(res.list)
            }).catch(err => reject)
        })
    }

    getTeachingSportsTestHealthData(): Promise<FreeKeyObject> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/teaching_info/sports_test_health'
            ).then(res => {
                let userInfos: any = res.userInfos
                
                if (userInfos !== undefined) {
                    resolve(userInfos[0])
                } else {
                    message.warning('没有体测数据')
                    reject('')
                }


            }).catch(err => reject)
        })
    }

    getTeachingSportsTestData(): Promise<FreeKeyObject> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/teaching_info/sports_test_data'
            ).then(res => {
                
                let userInfos: any = res.userInfos
                
                let userInfosGood = userInfos !== undefined
                    && userInfos.length > 0
                if (userInfosGood) {
                    resolve(userInfos[0])
                } else {
                    notification.warning({
                        message: '没有体锻数据'
                    })
                    reject('')
                }

            }).catch(err => reject)
        })
    }

    getOneTongjiSchoolCalendarAllTermCalendar(): Promise<FreeKeyObject> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/school_calendar_all_term_calendar'
            ).then(res => {
                resolve(res)
            }).catch(err => reject)
        })
    }

    getOneTongjiMessageList(): Promise<FreeKeyObject[]> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/msg_list'
            ).then(res => {
                resolve(res.list)
            }).catch(err => reject)
        })
    }

    getOneTongjiMessageDetail(
        id: number
    ): Promise<FreeKeyObject> {
        return new Promise((resolve, reject) => {
            this.oneTongjiApiProxy(
                '/v1/rt/onetongji/msg_detail?id='.concat(id.toString())
            ).then(res => {
                resolve(res)
            }).catch(err => reject)
        })
    }
}
