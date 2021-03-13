export function saveTokens(tokens) {
    document.cookie = `'accessToken=' ${tokens}`
    // document.cookie = 'accessToken=' + tokens
}

export function setCookie(cName, cValue, exDays) {
    const d = new Date()
    d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + d.toUTCString()
    document.cookie = cName + '=' + cValue + ';' + expires
}

export function getCookie(cName) {
    const name = cName + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}
