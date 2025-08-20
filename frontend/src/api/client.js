const BASE_URL = ''; // 프록시를 쓰면 빈 문자열, 직접 호출시 환경변수로 API 주소 지정

export async function request(url, options = {}) {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options,
    });

    // 성공 판정: 2xx (200 ~ 299) 이면 그대로 데이터 리턴
    if (res.ok) {
        return res.json().catch(() => null); // body 없으면 null 리턴
    }

    // 상태 코드별 에러 메시지
    let message = '알 수 없는 오류가 발생했습니다.';
    if (res.status === 400) message = '잘못된 요청입니다.';
    if (res.status === 401) message = '인증이 필요합니다.';
    if (res.status === 403) message = '접근 권한이 없습니다.';
    if (res.status === 404) message = '요청한 리소스를 찾을 수 없습니다.';
    if (res.status === 409) message = '이미 가입된 이메일입니다.';
    if (res.status >= 500) message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

    throw new Error(message);
}

export const api = {
    // ✅ 회원가입
    signup({ email, name, password }) {
        return request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, name, password }),
        });
    },

    // (선택) 로그인
    login({ email, password }) {
        return request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    // ✅ 국가 저장
    setNation({ email, nation }) {
        return request('/api/auth/nation', {
            method: 'POST',
            body: JSON.stringify({ email, nation }),
        });
    },

    // ✅ 언어 저장
    setLanguage({ email, language }) {
        return request('/api/auth/language', {
            method: 'POST',
            body: JSON.stringify({ email, language }),
        });
    },

    // (옵션) 한번에 업데이트
    updateProfile({ email, nation, language }) {
        return request('/api/auth/profile', {
            method: 'POST',
            body: JSON.stringify({ email, nation, language }),
        });
    },
};

