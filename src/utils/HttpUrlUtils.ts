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
    
}

export default class HttpUrlUtils {


    protected constructor() {}


    static getUrlData(): HttpUrlData {
        let curUrl = window.document.location.href
        let pathName = window.document.location.pathname
        let pos = curUrl.indexOf(pathName)

        let hostPath = curUrl.substring(0, pos)

        let args = new Map<string, string>()

        do { // do {...} while (0)

            if (pos + pathName.length >= curUrl.length) {
                break
            }
            
            let argsString = curUrl.substring(pos + pathName.length)

            if (argsString.charAt(0) !== '?') {
                break
            }

            let rawArgPairs = argsString.substring(1).split('&')
            for (let rawArgPair of rawArgPairs) {
                let segments = rawArgPair.split('=')

                if (segments.length < 2) {
                    continue
                }

                args.set(segments[0], segments[1])
            }

        } while (0)
        

        return {
            host: hostPath,
            path: pathName,
            args: args
        }
    }
}
