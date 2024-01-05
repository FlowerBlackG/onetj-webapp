/* 上财果团团 */

import MacroDefines from "../common/MacroDefines"

export default class URLNavigate {
    private constructor() {}

    /**
     * 
     * 会导致页面完全重新加载。
     */
    static to(url: string) {
        let loc = window.location
        
        if (url.startsWith('/')) {
            let ori = loc.origin + '/' + MacroDefines.WEB_ROOT_PATH
            loc.href = ori + url
        } else {
            loc.href += url
        }
    }

    static currentPath(): string {
        let loc = window.location
        let path = loc.pathname
        let envPath = MacroDefines.WEB_ROOT_PATH
        if (envPath.length > 0) {
            path = path.substring(
                path.indexOf(envPath) + envPath.length
            )
        }

        if (path.charAt(0) == '/') {
            path = path.substring(1)
        }

        return path
        
    }
}
