/* 上财果团团 */

/**
 * 日志采集工具。
 */

export default class Log {
    
    private constructor() {}

    static info(tag: string, msg: string) {
        console.info('[info] '.concat(tag).concat(': ').concat(msg))
    }

    static error(tag: string, msg: string) {
        console.error('[error] '.concat(tag).concat(': ').concat(msg))
    }

    static warn(tag: string, msg: string) {
        console.warn('[warn] '.concat(tag).concat(': ').concat(msg))
    }

    static warnO(obj: any) {
        console.warn(obj)
    }

    static errorO(obj: any) {
        console.error(obj)
    }

    static infoO(obj: any) {
        console.info(obj)
    }
}
