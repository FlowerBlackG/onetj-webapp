/* 上财果团团 */

import moment from "moment"

export default class DateTimeUtils {

    /**
     * 将 iso8601 格式的时间串转换为对人类更为友好的时间串。
     * 
     * iso8601 例：
     *   2009-06-15T12:45:30.000+00:00
     * 
     * 对人类更友好的例：
     *   2009年6月15日 12:45
     * 
     * @param original iso8601 格式的时间。
     * @param withSeconds 是否包含秒。
     * @returns 对人类更友好的时间串。
     */
    static iso8601toHumanFriendly(
        original: string, withSeconds: boolean = false
    ): string {
        let datetimeMoment = moment.utc(original).local()
        let fmt = 'yyyy年MM月DD日 HH:mm'
        if (withSeconds) {
            fmt += ':ss'
        }
        return datetimeMoment.format(fmt)
    }
}
