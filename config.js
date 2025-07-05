// 설정 파일 - config.js
(function() {
    'use strict';
    
    // 간단한 인코딩 함수
    function decode(encoded) {
        return atob(encoded);
    }
    
    // Base64로 인코딩된 API 키들
    const encodedKakaoKey = 'OWUxMzY2Yzc2NmIxNWVjYzJkNzA5NTRhY2Y0NmQyYzg=';
    const encodedNaverKey = 'bDB1emdVcDV2eQ=='; // l0uzgup5vy를 Base64로 인코딩
    
    // 전역 설정 객체
    window.AppConfig = {
        getKakaoKey: function() {
            // 도메인 검증
            const allowedDomains = ['127.0.0.1', 'localhost'];
            if (window.location.hostname && !allowedDomains.includes(window.location.hostname)) {
                return null;
            }
            return decode(encodedKakaoKey);
        },
        
        getNaverKey: function() {
            // 도메인 검증
            const allowedDomains = ['127.0.0.1', 'localhost', 'yourdomain.com'];
            if (window.location.hostname && !allowedDomains.includes(window.location.hostname)) {
                return null;
            }
            return decode(encodedNaverKey);
        },
        
        // 추가 보안 검증
        isValidDomain: function() {
            const allowedDomains = ['127.0.0.1', 'localhost', 'yourdomain.com'];
            return allowedDomains.includes(window.location.hostname);
        }
    };
})(); 