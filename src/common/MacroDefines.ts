/* 上财果团团 */

/**
 * 全局宏定义。
 */
export default class MacroDefines {
    private constructor() {}

    /* ------------ 网络请求相关 ------------ */

    /** 程序运行环境。 */
    static RUNTIME_ENVIRONMENT = process.env.REACT_APP_ENV as 'local' | 'dev' | 'release'

    /** 测试后端。 */
    static BACKEND_ROOT_DEV = 'https://guotuan.gardilily.com/api-dev'

    /** 生产后端。 */
    static BACKEND_ROOT_RELEASE = 'https://guotuan.gardilily.com/api'

    /** 本地后端。 */
    static BACKEND_ROOT_LOCAL = 'http://localhost:9005'

    /** web 根路径。 */
    static WEB_ROOT_PATH = ''

}
