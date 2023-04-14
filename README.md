# MusicNode

## 스크린샷

<img width="1440" alt="스크린샷 2023-04-14 오전 5 45 07" src="https://user-images.githubusercontent.com/55306894/231879664-cb440d2e-adbf-4676-8001-06b7dffd6d77.png">

## 실행 방법

### 환경

- Node.js 16.19.0  
- JDK 17.0.6  
- H2 Database 2.1.214  
- Yarn 1.22.19

### 순서

1. GitHub 저장소 내려받기

    ```
    git clone git@github.com:high2092/MusicNode.git
    ```

2. 환경변수 설정 (파일 이름 변경)

    client: `.env.example` → `.env`  
    server: `application.yml.example` → `application.yml`

3. H2 Database 실행 (설치 폴더로 가서 다음 명령어 입력)

    ```
    ./h2.sh # Windows의 경우 ./h2.bat
    ```

4. 프로젝트 루트 디렉토리로 이동

    ```
    cd MusicNode
    ````

5. 서버 실행

    ```
    cd server
    ./gradlew build -x test
    java -jar build/libs/musicnode-0.0.1-SNAPSHOT.jar
    ```

6. 클라이언트 실행 (새 터미널)

    ```
    cd client
    yarn
    yarn build
    yarn start
    ```

## 구현 완료된 기능 목록

### Music
#### 생성하기
- YouTube Data API를 활용한 키워드 검색을 할 수 있습니다.
- 검색 결과 클릭 시 Video ID와 곡 제목이 자동으로 설정됩니다.

### Music Node
#### 생성하기
- 미리 생성해둔 Music을 이용해 Node를 생성할 수 있습니다.
- 검색어 필터링을 통해 원하는 음악을 쉽게 찾을 수 있습니다.

#### 연결하기
- 연결리스트 인터페이스를 이용해 나만의 그래프를 구성할 수 있습니다.
- 사이클을 만들거나, 다양한 곡을 듣다가 사이클에 들어가도록 구성할 수도 있어요.

#### 감상하기
- 우측 하단의 YouTube IFrame API를 통해 Node가 재생됩니다.
- 곡이 끝나면 포인터로 연결한 다음 Node가 자동 재생됩니다.
- 곡이 끝나는 시점에 다음 Node를 계산하기 때문에, 최신 연결리스트 정보가 자동으로 반영됩니다.

### 플레이리스트
- 원하는 연결리스트를 완성한 다음 그대로 얼려서 정적인 플레이리스트를 생성할 수 있습니다.
- 정적인 플레이리스트는 코드로 제공되어 친구와 공유할 수 있어요.
- 플레이리스트 코드는 인터넷만 가능한 환경이라면 어댑터에서 정상적으로 사용할 수 있어요.

### 어댑터

- 별도 실행 없이 간단하게 사용할 수 있는 [재생 전용 페이지](https://music-node-playlist-adapter.vercel.app/v2eJyrVspLzE1VslJ63NoOR0o6Ssn5eSWpeSXFSlbR1TAlrze3vF614vW8GQpvp255vbkBqKwsMyU13zMFKGnuZhIYbOofnuNuAdJemZwD0pKRmpiiVKuDMKJ1x5uuJW%2Bbl7xZ3vBm2hYUE9J9QiKSQ%2FN0A52SlWpjawGvZT8U)입니다.
- 로컬 스토리지를 활용해 플레이리스트들을 저장하고 불러올 수 있습니다.

## 인터페이스 소개

### YouTube Data API 검색 결과
- 검색 결과 클릭 시 Video ID 입력값이 해당 검색 결과 ID로 설정됩니다.
- Video ID 입력값이 이미 해당 검색 결과 ID와 같을 경우에는 ID 대신 제목이 설정됩니다. 

### 드래그

- 목록에 있는 Music을 그래프 영역으로 드래그하면 해당 위치에 Music Node가 생성됩니다.
- 검색 결과를 그래프 영역으로 드래그하면 Music과 Music Node를 한번에 생성할 수 있습니다.

### 재생 완료 스택
- 재생이 완료된 노드는 스택에 저장됩니다.
- 미니 플레이어의 `이전 곡` 버튼을 누르면 그래프와 상관 없이 직전에 재생 완료된 곡이 재생됩니다.


## 구현 예정

### 카테고리 기능

- 유저가 카테고리를 만들고, 각 Music이 여러 개의 카테고리를 가질 수 있도록 할 예정 → 필터링 기능 개선

### 소셜 기능

- 유저끼리 친구를 맺고, 다른 사람의 그래프에 기여하거나 상호작용할 수 있도록 할 예정

### 여러가지 잡다한 기능

- Node를 재생 횟수, 생성 날짜 등 통계 정보

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
