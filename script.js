// 각 파일에서 사전 데이터 불러오기
import { noun } from './part_of_speech/noun.js';
import { adjective } from './part_of_speech/adjective.js';
import { verb } from './part_of_speech/verb.js';
import { pronoun } from './part_of_speech/pronoun.js';
import { josa } from './part_of_speech/josa.js';
import { busa } from './part_of_speech/busa.js';
import { gamtansa } from './part_of_speech/gamtansa.js';
import { susa } from './part_of_speech/susa.js';
import { gwan } from './part_of_speech/gwan.js';
import { p } from './part_of_speech/p.js';
import { mom } from './part_of_speech/mom.js';

// 양방향 맵을 생성하는 함수
function createBidirectionalMap(obj) {
    const bidirectionalMap = {};
    for (const key in obj) {
        // 원본 키-값 쌍 추가
        bidirectionalMap[key] = obj[key];
        // 값이 배열인 경우 처리
        if (Array.isArray(obj[key])) {
            obj[key].forEach(value => {
                bidirectionalMap[value] = key; // 반대 쌍 추가
            });
        } else {
            bidirectionalMap[obj[key]] = key; // 단일 값인 경우
        }
    }
    return bidirectionalMap;
}

// 각 품사의 단어들을 양방향 검색을 위한 맵으로 변환
const dictionaries = {
    동사: createBidirectionalMap(verb),
    형용사: createBidirectionalMap(adjective),
    명사: createBidirectionalMap(noun),
    대명사: createBidirectionalMap(pronoun),
    수사: createBidirectionalMap(susa),
    부사: createBidirectionalMap(busa),
    관형사: createBidirectionalMap(gwan),
    조사: createBidirectionalMap(josa),
    감탄사: createBidirectionalMap(gamtansa),
    어미: createBidirectionalMap(mom),
    표현어: createBidirectionalMap(p),
};

// 검색 함수
function search() {
    const query = document.getElementById("main-search").value.trim(); // 검색어 가져오기
    let results = []; // 결과 배열 초기화
    const addedResults = new Set(); // 중복 체크를 위한 Set

    // 검색
    for (const [key, dictionary] of Object.entries(dictionaries)) {
        // 키 검색
        if (dictionary[query]) {
            const values = dictionary[query]; // 배열로 된 값 가져오기
            const valueArray = Array.isArray(values) ? values : [values]; // 배열로 감싸기

            valueArray.forEach(value => { // 각 값에 대해 반복
                const resultKey = `${key}:${query}:${value}`; // 중복 체크용 키

                // 중복되지 않은 경우만 추가
                if (!addedResults.has(resultKey)) {
                    addedResults.add(resultKey); // Set에 추가
                    results.push(`
                        <div class="result-card">
                            <button class="copy-button" onclick="copyToClipboard('${value}')">
                                <i class="fas fa-copy"></i>
                            </button>
                            <div class="part-of-speech">${key}</div>
                            <div class="search-term">${query}</div>
                            <div class="translation">변환: ${value}</div>
                            <div class="naver-dictionary">
                                <a href="https://ko.dict.naver.com/#/search?range=all&query=${query}" target="_blank">네이버 사전에서 보기</a>
                            </div>
                        </div>
                    `);
                }
            });
        }

        // 값 검색
        for (const dictKey in dictionary) {
            if (dictKey === query) {
                const values = dictionary[dictKey]; // 배열로 된 값 가져오기
                const valueArray = Array.isArray(values) ? values : [values]; // 배열로 감싸기

                valueArray.forEach(value => { // 각 값에 대해 반복
                    const resultKey = `${key}:${dictKey}:${value}`; // 중복 체크용 키

                    // 중복되지 않은 경우만 추가
                    if (!addedResults.has(resultKey)) {
                        addedResults.add(resultKey); // Set에 추가
                        results.push(`
                            <div class="result-card">
                                <button class="copy-button" onclick="copyToClipboard('${value}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <div class="part-of-speech">${key}</div>
                                <div class="search-term">${dictKey}</div>
                                <div class="translation">변환: ${value}</div>
                                <div class="naver-dictionary">
                                    <a href="https://ko.dict.naver.com/#/search?range=all&query=${dictKey}" target="_blank">네이버 사전에서 보기</a>
                                </div>
                            </div>
                        `);
                    }
                });
            }
        }
    }

    // 결과가 없을 경우
    if (results.length === 0) {
        results.push("결과 없음");
    }

    // 결과를 출력
    document.getElementById("output").innerHTML = results.join(''); // 배열을 HTML 형식으로 연결하여 출력
}

// 클립보드에 복사하는 함수
function copyToClipboard(text) {
    navigator.clipboard.writeText(text); // 복사
}

// 문장 작성법 내용
const grammarInstructions = `
    문장 만드는 법 (예문 통합으로 인해 어색한 표현이 있을 수 있음.)

    원래 기본적인 문장을 단어별로 나눈다.
    나는 밥을 잘 먹는다. -> 나, 는, 밥, 을, 잘, 먹다 (기본형이 원칙)

    나눈 단어들을 각각 돌멩어로 변환한다.
    돓, 젧, 니, 으므, 아이거나, 잇이

    다음 단어들을 원래대로 조합한다. (모든 단어는 다 띄어씀.)
    돓 젧 니 으므 아이거나 잇이.: 나는 밥을 잘 먹다. (활용형의 경우 상황에 따라 직접 잘 해석해야 해서 서로 다른 해석이 있을 수 있음.)

    활용형은 시간 표현과 문장 종류 표현 외에는 알 방법이 없다.

    먹었다 등의 과거를 나타내는 표현은 뒤에 '없이까'를 붙인다.
    돓 젧 니 으므 아이거나 잇이 없이까.: 나는 밥을 잘 먹었다.

    현재를 나타내는 표현은 '후읶까'를 붙인다.
    돓 젧 니 으므 아이거나 잇이 후읶까.: 나는 밥을 잘 먹는다.

    미래를 나타내는 표현은 '윌리읶까'를 붙인다.
    돓 젧 니 으므 아이거나 잇이 윌리읶까.: 나는 밥을 잘 먹을 것이다.

    평서문의 경우 아무것도 붙이지 않으며 부정문에 경우 '싸리띠뚦'을 붙인다.
    돓 젧 니 으므 아이거나 잇이 싸리띠뚦.: 나는 밥을 잘 먹지 않다.

    의문문과 명령문, 감탄문은 각각 '띠이뚦', '캀쌀뚦', '우릯뚦'을 붙인다.
    돓 젧 니 으므 아이거나 잇이 우릯뚦!: 너는 밥을 잘 먹는다!

    부정 표현과 감탄 표현, 현재 표현을 쓴다고 가정했을 때, 현재 표현, 부정 표현, 감탄 표현 순서로 뒤에 붙인다.
    돓 젧 니 으므 아이거나 잇이 후읶까 싸리띠뚦 우릯뚦!: 너는 밥을 잘 먹지 않는다!

    다른 사람이 잘 알아볼 수 있는 한에서 줄여 쓰거나 규칙을 어길 수 있다.
    표준) 돓 젧 니 으므 아이거나 잇이 윌리읶까 띠이뚦?
    줄임) 돓 젧 니 으므 아이거나 잇이 윌리띠이뚦?

    같은 품사 내에서의 동음이의어는 제작의 편의, 사용의 편의를 위하여 만들어지지 않았으므로, 다른 뜻의 단어이더라도 똑같이 사용할 수 있다.

    사전에 등록되지 않은 단어의 경우 원래대로 쓰면 된다. 문의를 넣으면 추후 생길 수 있다.
`;

// 문장 작성법 출력 함수
function showGrammarInstructions() {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <div class="result-card">
            <div class="part-of-speech">문장 작성법</div>
            <div class="translation">${grammarInstructions.replace(/\n/g, '<br>')}</div>
        </div>
    `;
}

// 사이드바 토글 함수
// 사이드바 토글 함수
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");

    // 여백 조정 (사이드바가 열릴 때, 본문 여백을 오른쪽으로 250px 이동)
    if (sidebar.classList.contains("open")) {
        document.body.style.marginRight = "250px";
    } else {
        document.body.style.marginRight = "0";
    }
}

// 전역으로 함수 설정
window.toggleSidebar = toggleSidebar;


// 섹션 전환 함수
function showSection(section) {
    const outputDiv = document.getElementById("output");
    
    if (section === 'grammar') {
        showGrammarInstructions(); // 문장 작성법 카드 생성
    } else {
        outputDiv.innerHTML = ""; // 다른 섹션 선택 시 비우기
    }
}

// 전용 앱 다운로드 함수
function downloadApp() {
    const apkUrl = "https://github.com/DDuya24/apkdolmengasajeon/releases/download/apk/default.apk";
    window.location.href = apkUrl;
}

// 키 입력 시 검색 실행
function handleKeyUp(event) {
    if (event.key === 'Enter') {
        search(); // Enter 키를 누르면 검색 실행
    }
}

// 전역으로 함수 설정
window.search = search;
window.handleKeyUp = handleKeyUp;
window.copyToClipboard = copyToClipboard;
window.toggleSidebar = toggleSidebar;
window.showSection = showSection;
window.downloadApp = downloadApp;
window.showGrammarInstructions = showGrammarInstructions;
