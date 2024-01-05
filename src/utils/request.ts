/* 上财果团团 */

/*
 * 果团团控制台通用网络请求工具。
 */

import { message } from "antd"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { resetGlobalData } from "../common/GlobalData"
import { HttpStatusCode } from "./HttpStatusCode"
import URLNavigate from "./URLNavigate"

/**
 * 默认的网络异常处理逻辑：弹出提示信息。
 * 
 * @param isReallyNetworkError 是不是真的是网络错误。当服务器后端出现错误，也会调用此函数。
 */
function defaultNetworkExceptionHandler(isReallyNetworkError: boolean) {
    message.error({
        content: isReallyNetworkError ? '网络异常' : '服务器异常'
    })
}

/**
 * 默认的未登录处理逻辑：跳转到登录页。
 */
function defaultUnauthorizedExceptionHandler() {
    resetGlobalData()
    URLNavigate.to('/login')
}


/**
 * 果团团网络请求工具。
 * 对 axios 做二次封装，且内部处理后端环境配置。
 * 参考自同济大学破壁工作室济星云项目。
 * 
 * @author GTY
 * 
 * @param params axios 网络请求参数。请将要请求的 url 放置在其中。
 *               如果请求的是果团自有 api，则不要写根路径（https://xxx）。
 *               如果访问的是外部 api，需要令 url 以 https 开头。
 * 
 * @param useDefaultNetworkExceptionHandler 当遇到网络异常或服务器异常时，是否执行默认处理逻辑。该选项默认开启。
 */
export function request(
    params: AxiosRequestConfig,
    useDefaultNetworkExceptionHandler: boolean = true
): Promise<AxiosResponse<any, any> > {

    return new Promise((resolve, reject) => {
        axios.request(params).then(res => {
            // axios 请求成功。

            resolve(res)
            
        }).catch(err => {
            
            // axios 请求异常。

            if (useDefaultNetworkExceptionHandler) {
                defaultNetworkExceptionHandler(true)
            }

            reject(err)
            
        })
    })
}
