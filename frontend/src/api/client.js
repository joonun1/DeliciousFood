const BASE_URL = ''; // 프록시를 쓰면 빈 문자열, 직접 호출시 환경변수로 API 주소 지정

async function request(path, options = {}) {
    const res = await fetch(BASE_URL + path, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        credentials: 'include', // 쿠키 기반 세션 유지 시 필요
        ...options,
    })

    const isJson = res.headers.get('content-type')?.includes('application/json')
    const data = isJson ? await res.json() : await res.text()

    if (!res.ok) {
        const message = (data && data.message) || `HTTP ${res.status}`
        throw new Error(message)
    }

    return data
}

export const api = {
    signup(payload) {
        return request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        })
    },
}
