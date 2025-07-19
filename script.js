// 갤러리 이미지 팝업 기능
function initGallery() {
    const galleryImages = document.querySelectorAll('.gallery-row img');
    let currentImageIndex = 0;
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            showExpandedImage(index);
        });
    });

    function showExpandedImage(index) {
        currentImageIndex = index;
        
        const expandedDiv = document.createElement('div');
        expandedDiv.classList.add('image-expanded');
        
        // 이미지 컨테이너 추가
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('expanded-image-container');
        
        // 닫기 버튼 추가
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '<i class="bi bi-x-lg"></i>';
        
        // 이미지 추가
        const expandedImg = new Image();
        expandedImg.src = galleryImages[currentImageIndex].src;
        expandedImg.alt = galleryImages[currentImageIndex].alt;
        
        // 네비게이션 버튼 추가
        const prevButton = document.createElement('button');
        prevButton.classList.add('nav-button', 'prev-button');
        prevButton.innerHTML = '<i class="bi bi-chevron-left"></i>';
        
        const nextButton = document.createElement('button');
        nextButton.classList.add('nav-button', 'next-button');
        nextButton.innerHTML = '<i class="bi bi-chevron-right"></i>';
        
        // 요소들 조립
        imageContainer.appendChild(expandedImg);
        expandedDiv.appendChild(closeButton);
        expandedDiv.appendChild(prevButton);
        expandedDiv.appendChild(nextButton);
        expandedDiv.appendChild(imageContainer);
        document.body.appendChild(expandedDiv);
        
        // History API를 사용하여 뒤로가기 버튼 처리
        history.pushState({ imageExpanded: true }, '', '');
        
        // 팝업 닫기 함수
        function closePopup() {
            if (document.body.contains(expandedDiv)) {
                document.body.removeChild(expandedDiv);
            }
            // popstate 이벤트 리스너 제거
            window.removeEventListener('popstate', handlePopState);
        }
        
        // popstate 이벤트 핸들러
        function handlePopState(event) {
            if (!event.state || !event.state.imageExpanded) {
                closePopup();
            }
        }
        
        // popstate 이벤트 리스너 추가
        window.addEventListener('popstate', handlePopState);
        
        // 이벤트 리스너 추가
        closeButton.addEventListener('click', () => {
            closePopup();
            history.back();
        });
        
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            expandedImg.src = galleryImages[currentImageIndex].src;
        });
        
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            expandedImg.src = galleryImages[currentImageIndex].src;
        });
        
        // 스와이프 기능 추가 및 줌 방지
        let touchStartX = 0;
        let touchEndX = 0;
        
        expandedDiv.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            // 멀티터치 줌 방지
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
        
        expandedDiv.addEventListener('touchmove', (e) => {
            // 멀티터치 줌 방지
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
        
        expandedDiv.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    // 오른쪽으로 스와이프 - 이전 이미지
                    prevButton.click();
                } else {
                    // 왼쪽으로 스와이프 - 다음 이미지
                    nextButton.click();
                }
            }
        }
    }
}

// 네이버 지도 초기화 함수
function initNaverMap() {
    if (typeof naver === 'undefined') {
        console.error('Naver Maps API is not loaded');
        return;
    }

    naver.maps.onJSContentLoaded = function() {
        const mapOptions = {
            center: new naver.maps.LatLng(36.3562313, 127.3514617), // 유성컨벤션웨딩홀 좌표
            zoom: 17,
            zoomControl: true,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT
            }
        };

        const map = new naver.maps.Map('map', mapOptions);
        
        // 더 작은 핑크 핀 마커 아이콘
        const markerIcon = {
            content: `
                <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#shadow)">
                        <path d="M14 1.5C6.5 1.5 1.5 7.5 1.5 14.5C1.5 24 14 36.5 14 36.5C14 36.5 26.5 24 26.5 14.5C26.5 7.5 21.5 1.5 14 1.5Z" fill="#FF4F8B"/>
                        <circle cx="14" cy="15" r="8" fill="white"/>
                    </g>
                    <defs>
                        <filter id="shadow" x="0" y="0" width="28" height="38" filterUnits="userSpaceOnUse">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.12"/>
                        </filter>
                    </defs>
                </svg>
            `,
            size: new naver.maps.Size(28, 38),
            anchor: new naver.maps.Point(14, 38)
        };

        // 커스텀 마커 생성
        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(36.3562313, 127.3514617),
            map: map,
            icon: markerIcon
        });

        // 더 고급스러운 정보창 HTML
        const infoWindow = new naver.maps.InfoWindow({
            content: [
                '<div style="padding:16px 20px;min-width:200px;line-height:1.7;background:linear-gradient(135deg,#f8f6f4 0%,#ece9e6 100%);border-radius:14px;box-shadow:0 2px 10px rgba(60,60,60,0.08);font-family: \'Playfair Display\', \'Cormorant Garamond\', \'Noto Serif KR\', serif; text-align:center;">',
                '<h4 style="margin:0 0 8px 0;font-size:16px;color:#7c3a2d;font-weight:600;letter-spacing:0.5px;font-family: \'Playfair Display\', \'Cormorant Garamond\', serif;">유성컨벤션웨딩홀 3층 그랜드홀</h4>',
                '<div style="font-size:13px;color:#444;margin-bottom:4px;font-family: \'Cormorant Garamond\', \'Noto Serif KR\', serif;">대전광역시 유성구 온천북로77</div>',
                '<div style="margin-top:6px;font-size:12px;color:#7a6f6f;font-style:italic;font-family: \'Cormorant Garamond\', \'Noto Serif KR\', serif;">2025년 8월 23일 토요일 오후 2시</div>',
                '</div>'
            ].join('')
        });

        // 마커 클릭시 정보창 표시
        naver.maps.Event.addListener(marker, "click", function(e) {
            if (infoWindow.getMap()) {
                infoWindow.close();
            } else {
                infoWindow.open(map, marker);
            }
        });
    };
}

// 계좌 정보 팝업 기능
function toggleAccounts(type) {
    // 기존 팝업이 있다면 제거
    const existingPopup = document.querySelector('.account-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // 계좌 정보 설정
    const accountInfo = {
        groom: {
            title: '신랑측 계좌번호🤵‍♀️',
            accounts: [
                {
                    name: '신랑 이태민',
                    bank: '국민은행',
                    number: '460002-04-098603'
                },
                {
                    name: '혼주 이재용',
                    bank: '국민은행',
                    number: '457211-28-3692'
                },
                {
                    name: '혼주 김혜자',
                    bank: '국민은행',
                    number: '457211-31-5034'
                }
            ]
        },
        bride: {
            title: '신부측 계좌번호👰‍♀️',
            accounts: [
                {
                    name: '신부 김혜현',
                    bank: '국민은행',
                    number: '605102-04-161344'
                },
                {
                    name: '혼주 김기수',
                    bank: '농협은행',
                    number: '631-12-331336'
                },
                {
                    name: '혼주 허미숙',
                    bank: '기업은행',
                    number: '010-4484-1467'
                }
            ]
        }
    };

    // 팝업 생성
    const popup = document.createElement('div');
    popup.className = `account-popup ${type === 'groom' ? 'groom-popup' : 'bride-popup'}`;
    
    // 팝업 내용 생성
    const content = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>${accountInfo[type].title}</h3>
                <button class="close-button">×</button>
            </div>
            <div class="popup-body">
                ${accountInfo[type].accounts.map(account => `
                    <div class="account-info-row">
                        <div class="account-details">
                            <div class="account-name">${account.name}</div>
                            <div class="account-bank">${account.bank}</div>
                            <div class="account-number">${account.number}</div>
                        </div>
                        <button class="copy-button" 
                            data-number="${account.number}"
                            data-bank="${account.bank}">📋 복사하기</button>
                    </div>
                `).join('')}
            </div>
            <button class="close-popup-button">닫기</button>
        </div>
    `;

    popup.innerHTML = content;
    document.body.appendChild(popup);



    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .account-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .popup-content {
            background: linear-gradient(145deg, #ffffff 0%, #f8f8f8 100%);
            width: 90%;
            max-width: 420px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
            animation: slideUp 0.4s ease;
            font-family: 'Noto Serif KR', serif;
        }

        .popup-header {
            padding: 25px 25px 20px 25px;
            background: linear-gradient(135deg, #f8f6f4 0%, #ece9e6 100%);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .popup-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #ff6b8a, #ff8fa3, #ffa8b8);
        }

        .popup-header h3 {
            margin: 0;
            font-size: 20px;
            font-weight: 400;
            color: #7c3a2d;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .close-button {
            background: rgba(255,255,255,0.8);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .close-button:hover {
            background: rgba(255,255,255,1);
            transform: scale(1.1);
            color: #333;
        }

        .popup-body {
            padding: 25px;
        }

        .account-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            position: relative;
        }

        .account-info-row:last-child {
            border-bottom: none;
        }

        .account-info-row::before {
            content: '💳';
            position: absolute;
            left: -5px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            opacity: 0.6;
        }

        .account-details {
            flex: 1;
            padding-left: 25px;
        }

        .account-name {
            font-weight: 500;
            font-size: 16px;
            margin-bottom: 6px;
            color: #333;
            letter-spacing: 0.3px;
        }

        .account-bank {
            font-size: 13px;
            color: #888;
            margin-bottom: 8px;
            font-weight: 400;
        }

        .account-popup .account-number,
        .popup-content .account-number {
            font-size: 13px;
            color: #888;
            margin-bottom: 8px;
            font-weight: 400;
        }

        .copy-button {
            padding: 10px 18px;
            background: linear-gradient(135deg, #ff6b8a 0%, #ff8fa3 100%);
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 107, 138, 0.3);
            letter-spacing: 0.3px;
        }

        .copy-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(255, 107, 138, 0.4);
            background: linear-gradient(135deg, #ff8fa3 0%, #ffa8b8 100%);
        }

        .copy-button:active {
            transform: translateY(0);
        }

        .close-popup-button {
            width: 100%;
            padding: 18px;
            border: none;
            background: linear-gradient(135deg, #f8f6f4 0%, #ece9e6 100%);
            color: #7c3a2d;
            font-size: 16px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            letter-spacing: 0.5px;
            font-family: 'Noto Serif KR', serif;
        }

        .close-popup-button:hover {
            background: linear-gradient(135deg, #ece9e6 0%, #e0ddd8 100%);
            color: #5a2a1f;
        }

        /* 복사 완료 애니메이션 */
        .copy-button.copied {
            background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%) !important;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
        }

        /* 신랑측 팝업 파란색 파스텔 톤 스타일 */
        .groom-popup .popup-header {
            background: linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%);
        }

        .groom-popup .popup-header::before {
            background: linear-gradient(90deg, #42a5f5, #66bb6a, #81c784);
        }

        .groom-popup .popup-header h3 {
            color: #1565c0;
        }

        .groom-popup .copy-button {
            background: linear-gradient(135deg, #42a5f5 0%, #66bb6a 100%);
            box-shadow: 0 4px 12px rgba(66, 165, 245, 0.3);
        }

        .groom-popup .copy-button:hover {
            background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
            box-shadow: 0 6px 16px rgba(66, 165, 245, 0.4);
        }
    `;
    document.head.appendChild(style);

    // 이벤트 리스너 추가
    const closeButtons = popup.querySelectorAll('.close-button, .close-popup-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            popup.remove();
        });
    });

    // 복사 버튼 기능
    const copyButtons = popup.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = button.dataset.number;
            const bank = button.dataset.bank;
            const copyText = `${bank} ${number}`;  // 은행명과 계좌번호를 함께 복사
            
            navigator.clipboard.writeText(copyText).then(() => {
                button.classList.add('copied');
                button.textContent = '✅ 복사완료';
                
                // 부드러운 애니메이션으로 원래 상태로 복귀
                setTimeout(() => {
                    button.style.transition = 'all 0.3s ease';
                    button.classList.remove('copied');
                    button.textContent = '📋 복사하기';
                }, 2000);
            });
        });
    });

    // 배경 클릭시 팝업 닫기
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });
}

// 꽃잎 애니메이션 기능
function initPetalAnimation() {
    const container = document.querySelector('.petals-container');
    const numberOfPetals = 40; // 더 넓은 범위를 위해 꽃잎 개수 증가

    function createPetal(isInitial = false) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        const size = 10 + Math.random() * 12;  // 8-20px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        petal.style.left = `${Math.random() * 120 - 10}%`;
        
        // 초기 꽃잎은 화면 상단에서 시작
        if (isInitial) {
            petal.style.top = `${Math.random() * 10 - 5}%`; // 화면 -5% ~ 5% 위치에서 시작 (더 위쪽)
        } else {
            petal.style.top = '-60px'; // 화면 위쪽에서 더 멀리 시작
        }

        const colors = [
            '#ffd1dc',
            '#ffb7c5',
            '#ffc9d3',
            '#ffe1e6',
            '#fff0f3'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const svgFill = randomColor.replace('#', '%23');
        petal.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='${svgFill}' d='M12,1C8.1,1,5,4.1,5,8c0,2.4,1.2,4.5,3,5.7V15c0,2.2,1.8,4,4,4s4-1.8,4-4v-1.3c1.8-1.3,3-3.4,3-5.7 C19,4.1,15.9,1,12,1z'/%3E%3C/svg%3E")`;
        
        container.appendChild(petal);
        return petal;
    }

    function animatePetal(petal) {
        const duration = 12000 + Math.random() * 8000;  // 12-20초로 조정

        const points = [];
        const segments = 10;
        
        // 갤러리 섹션 전까지 떨어지도록 높이를 늘림
        const fallHeight = window.innerHeight * 2.5; // 화면 높이의 2.5배까지 떨어짐 (갤러리 섹션 전까지)
        
        for(let i = 0; i <= segments; i++) {
            const progress = i / segments;
            points.push({
                // 좌우 움직임 범위 조절
                x: Math.sin(progress * Math.PI * 2.5) * (80 + Math.random() * 40),
                y: fallHeight * progress
            });
        }

        if (typeof anime !== 'undefined') {
            anime({
                targets: petal,
                translateX: [
                    { value: points[0].x, duration: 0 }, // 즉시 첫 번째 위치로
                    ...points.slice(1).map((point, index) => ({
                        value: point.x,
                        duration: duration / points.length,
                        delay: 0
                    }))
                ],
                translateY: [
                    { value: points[0].y, duration: 0 }, // 즉시 첫 번째 위치로
                    ...points.slice(1).map((point, index) => ({
                        value: point.y,
                        duration: duration / points.length,
                        delay: 0
                    }))
                ],
                rotate: [
                    { 
                        value: () => {
                            // 회전 속도 조절
                            const rotations = [-720, -540, 540, 720];
                            return rotations[Math.floor(Math.random() * rotations.length)];
                        },
                        duration: duration,
                        easing: 'easeInOutQuad'
                    }
                ],
                scale: [
                    { 
                        value: [1, 0.9, 1.1, 0.9, 1.1, 1],
                        duration: duration,
                        easing: 'easeInOutSine'
                    }
                ],
                opacity: [
                    { value: 0.7, duration: 0 }, // 즉시 나타남
                    { value: 0.7, duration: duration - 400 }, // 나머지 시간동안 유지
                    { value: 0, duration: 400 } // 빠르게 사라짐
                ],
                duration: duration,
                easing: 'linear',
                delay: 0, // 지연 없이 바로 시작
                complete: function() {
                    petal.remove();
                    const newPetal = createPetal();
                    setTimeout(() => animatePetal(newPetal), Math.random() * 1000);  // 재생성 간격을 더 빠르게
                }
            });
        }
    }

    function startPetals() {
        // 초기 꽃잎 20개를 화면 상단에서 시작
        for (let i = 0; i < 20; i++) {
            const petal = createPetal(true);
            setTimeout(() => {
                animatePetal(petal);
            }, i * 100); // 더 빠른 간격으로 생성
        }

        // 나머지 꽃잎들은 중간 꽃잎이 떨어지기 시작할 때 이어서 생성
        for (let i = 20; i < numberOfPetals; i++) {
            setTimeout(() => {
                const petal = createPetal();
                animatePetal(petal);
            }, i * 100 + Math.random() * 100);  // 생성 간격을 100ms로 조정
        }
    }

    startPetals();
}

// 타이핑 애니메이션 기능
function initTypingAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                if (target.classList.contains('greeting-content')) {
                    // greeting-content가 화면에 나타나면 즉시 타이핑 시작
                    const greetingTitle = target.querySelector('.greeting-title');
                    if (greetingTitle) {
                        typeText(greetingTitle, '결혼합니다', 200);
                    }
                }
                
                // 한 번만 실행하고 관찰 중단
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    // 관찰할 요소들 추가
    const greetingContent = document.querySelector('.greeting-content');
    
    if (greetingContent) observer.observe(greetingContent);
}

// 텍스트 타이핑 효과
function typeText(element, text, speed = 150) {
    element.textContent = '';
    element.classList.add('typing');
    
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // 타이핑 완료 후 커서 제거
            setTimeout(() => {
                element.classList.remove('typing');
            }, 1000);
        }
    }
    
    type();
}

// 터치 하트 효과 기능
function initTouchHearts() {
    let touchStartTime;
    let touchStartPos;
    let isScrolling = false;
    
    // 터치 시작
    document.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        isScrolling = false;
    }, { passive: true });
    
    // 터치 이동 (스크롤 감지)
    document.addEventListener('touchmove', function(e) {
        if (touchStartPos) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.x);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.y);
            
            // 스크롤 중인지 확인 (세로 이동이 가로 이동보다 클 때)
            if (deltaY > 10 && deltaY > deltaX) {
                isScrolling = true;
            }
        }
    }, { passive: true });
    
    // 터치 끝
    document.addEventListener('touchend', function(e) {
        if (!touchStartPos) return;
        
        const touchDuration = Date.now() - touchStartTime;
        
        // 인터랙티브 요소 체크
        const target = document.elementFromPoint(touchStartPos.x, touchStartPos.y);
        if (target && (
            (target.tagName === 'BUTTON' && !target.closest('.carousel-indicators')) || 
            target.tagName === 'A' || 
            (target.closest('button') && !target.closest('.carousel-indicators')) || 
            target.closest('a') ||
            target.closest('.music-controls') ||
            target.closest('.account-popup') ||
            target.closest('.image-expanded') ||
            target.closest('.gallery-section') ||
            target.closest('.gallery-row') ||
            (target.closest('.carousel') && !target.closest('.carousel-indicators')) ||
            target.closest('.contact-button') ||
            target.closest('.share-button'))) {
            return;
        }
        
        // 짧은 터치이고 스크롤이 아닐 때만 하트 생성
        if (touchDuration < 300 && !isScrolling) {
            createHeart(touchStartPos.x, touchStartPos.y);
        }
    }, { passive: true });
    
    // 클릭 이벤트 (데스크톱)
    document.addEventListener('click', function(e) {
        // 인터랙티브 요소들을 클릭할 때는 하트 생성 안함
        if ((e.target.tagName === 'BUTTON' && !e.target.closest('.carousel-indicators')) || 
            e.target.tagName === 'A' || 
            (e.target.closest('button') && !e.target.closest('.carousel-indicators')) || 
            e.target.closest('a') ||
            e.target.closest('.music-controls') ||
            e.target.closest('.account-popup') ||
            e.target.closest('.image-expanded') ||
            e.target.closest('.gallery-section') ||
            e.target.closest('.gallery-row') ||
            (e.target.closest('.carousel') && !e.target.closest('.carousel-indicators')) ||
            e.target.closest('.contact-button') ||
            e.target.closest('.share-button')) {
            return;
        }
        
        createHeart(e.clientX, e.clientY);
    });
    
    function createHeart(x, y) {
        // 여러 개의 하트 생성 (1-3개)
        const heartCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                generateSingleHeart(x, y, i);
            }, i * 100);
        }
    }
    
    function generateSingleHeart(x, y, index) {
        const heart = document.createElement('div');
        heart.className = 'touch-heart';
        
        // 다양한 하트 이모지
        const heartTypes = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];
        heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        
        // 위치 설정 (약간씩 다르게)
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 20;
        
        heart.style.left = (x + offsetX) + 'px';
        heart.style.top = (y + offsetY) + 'px';
        
        // 크기 랜덤
        const size = 16 + Math.random() * 8;
        heart.style.fontSize = size + 'px';
        
        // 애니메이션 지속시간 랜덤
        const duration = 1500 + Math.random() * 1000;
        heart.style.animation = `heartFloat ${duration}ms ease-out`;
        
        document.body.appendChild(heart);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration);
    }
}

// 스크롤 애니메이션 기능
function initScrollAnimation() {
    // Intersection Observer 설정
    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px", // 화면 중앙 근처에 도달했을 때 감지
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 한 번 나타난 섹션은 더 이상 관찰하지 않음
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 모든 fade-in-section 클래스를 가진 요소들을 관찰
    const fadeElems = document.querySelectorAll('.fade-in-section');
    fadeElems.forEach(elem => observer.observe(elem));
}

// 음악 제어 기능
function initMusicControls() {
    const music = document.getElementById('background-music');
    const playBtn = document.getElementById('play-music');
    const pauseBtn = document.getElementById('pause-music');
    const visualizer = document.getElementById('music-visualizer');

    // 웨이브 시각화 제어 함수
    function startVisualizer() {
        visualizer.classList.add('active');
        playBtn.classList.add('playing');
        pauseBtn.classList.add('playing');
    }

    function stopVisualizer() {
        visualizer.classList.remove('active');
        playBtn.classList.remove('playing');
        pauseBtn.classList.remove('playing');
    }

    // 페이지 로드 시 음악 자동 재생
    music.play().then(() => {
        // 재생 성공 시 버튼 상태 변경
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        startVisualizer();
    }).catch(error => {
        // 자동 재생이 차단된 경우 (브라우저 정책)
        console.log("자동 재생이 차단되었습니다:", error);
        // 버튼 상태는 그대로 유지
        stopVisualizer();
    });

    playBtn.addEventListener('click', function() {
        music.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        startVisualizer();
    });

    pauseBtn.addEventListener('click', function() {
        music.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline-block';
        stopVisualizer();
    });

    // 음악 이벤트 리스너 추가
    music.addEventListener('play', startVisualizer);
    music.addEventListener('pause', stopVisualizer);
    music.addEventListener('ended', stopVisualizer);
}

// D-DAY 카운트다운 기능
function startCountdown() {
    // 결혼식 날짜: 2025년 8월 23일 토요일 오후 2시
    const weddingDate = new Date('2025-08-23T14:00:00+09:00');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // 숫자 애니메이션 효과
            animateNumber('days', days);
            animateNumber('hours', hours);
            animateNumber('minutes', minutes);
            animateNumber('seconds', seconds);
        } else {
            // 결혼식 당일이 되면
            document.querySelector('.dday-message p').innerHTML = '오늘이 바로 그 날입니다! 💕';
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
        }
    }
    
    function animateNumber(id, newValue) {
        const element = document.getElementById(id);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent);
        
        if (currentValue !== newValue) {
            element.style.transform = 'scale(1.05)';
            element.style.opacity = '0.7';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            }, 200);
        }
    }
    
    // 초기 실행
    updateCountdown();
    
    // 1초마다 업데이트
    setInterval(updateCountdown, 1000);
}

// 카카오톡 공유 기능
function shareKakao() {
    if (!window.Kakao) {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
    }

    const currentUrl = window.location.href;
    const imageUrl = new URL('./img/KakaoTalk_20250705_101845888.jpg', currentUrl).href;

    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: '이태민 ❤️ 김혜현 결혼합니다',
            description: '2025년 8월 23일 토요일 오후 2시\n유성컨벤션웨딩홀 3층 그랜드홀\n\n새로운 마음과 새 의미를 간직하며 저희 두 사람이 새 출발의 첫걸음을 내딛습니다.',
            imageUrl: imageUrl,
            link: {
                mobileWebUrl: currentUrl,
                webUrl: currentUrl
            }
        },
        buttons: [
            {
                title: '청첩장 보기',
                link: {
                    mobileWebUrl: currentUrl,
                    webUrl: currentUrl
                }
            }
        ]
    });
}

// URL 복사 기능
function initUrlCopyFunction() {
    const urlCopyButton = document.querySelector('.share-button.url');
    if (urlCopyButton) {
        urlCopyButton.addEventListener('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    alert('URL이 복사되었습니다.');
                });
        });
    }
}

// 전체 초기화 함수
function initializeApp() {
    // 갤러리 초기화
    initGallery();
    
    // 네이버 지도 초기화
    initNaverMap();
    
    // 스크롤 애니메이션 초기화
    initScrollAnimation();
    
    // 음악 제어 초기화
    initMusicControls();
    
    // 꽃잎 애니메이션 초기화
    initPetalAnimation();
    
    // 터치 하트 효과 초기화
    initTouchHearts();
    
    // 타이핑 애니메이션 초기화
    initTypingAnimation();
    
    // URL 복사 기능 초기화
    initUrlCopyFunction();
    
    // 카카오 SDK 초기화
    if (window.Kakao) {
        Kakao.init('9e1366c766b15ecc2d70954acf46d2c8');
    }
    
    // D-DAY 카운트다운 시작
    startCountdown();
}

// DOM이 로드되면 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initializeApp); 