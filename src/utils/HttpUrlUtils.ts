/*
 * 2051565 GTY
 * 创建于2024年1月5日 江西省上饶市玉山县
 */

interface HttpUrlData {
    /** 例：https://tongji.edu.cn */
    host: string

    /** 例：api/login */
    path: string

    args: Map<string, string>

    hasHashText: boolean
    hashText: string
    
}

export default class HttpUrlUtils {


    protected constructor() {}


    static getUrlData(): HttpUrlData {

        let fullUrl = window.document.location.href

        let urlObj = new URL(fullUrl)

        let host = window.document.location.host
        let fullPath = fullUrl.substring(
            host.length + fullUrl.indexOf(host)
        )

        let pos = fullUrl.indexOf(fullPath)
        let hostPath = fullUrl.substring(0, pos)

        let args = new Map<string, string>()

        let hashText = ''
        let idxOfHashMark = fullUrl.indexOf('#')
        let hasHashText = idxOfHashMark !== -1

        if (hasHashText) {
            hashText = fullUrl.substring(idxOfHashMark + 1)
        }
        
        let idxOfQuestMark = fullUrl.indexOf('?')

        urlObj.searchParams.forEach((value, key) => {
            args.set(key, value)
        })

        let pathName = fullPath
        if (idxOfQuestMark !== -1) {
            pathName = fullUrl.substring(pos, idxOfQuestMark)
        } else if (hasHashText) {
            pathName = fullUrl.substring(pos, idxOfHashMark)
        }

        return {
            host: hostPath,
            path: pathName,
            args: args,
            hasHashText: hasHashText,
            hashText: hashText
        }
    }
}
