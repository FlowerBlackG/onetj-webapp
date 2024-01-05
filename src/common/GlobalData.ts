/* 上财果团团 */

import { message } from "antd"
import React from "react"
import { HttpStatusCode } from "../utils/HttpStatusCode"
import { request } from "../utils/request"
import LayoutFrame from "../components/LayoutFrame/LayoutFrame"

/**
 * 全局变量。
 */

export const globalData = {


    /** 
     * 指向边框对象的引用。 
     * 在 PageRoutes::preprocess 内设置。
     */
    layoutFrameRef: React.createRef<LayoutFrame>(),

}

export function resetGlobalData() {

}

/**
 * 用户浏览器刷新时，globalData 可能会被清空，但 session 仍存在。
 * 此时，需要重新获取用户信息。
 */
export function ensureGlobalData() {
    let exceptionOccurreded = false
    let resolved = false

    return new Promise((resolve, reject) => {
        resolve(null)
        
    })
}

function loadBasicInfo() {
    return new Promise((resolve, reject) => {
        resolve(null)
    })
    
}
