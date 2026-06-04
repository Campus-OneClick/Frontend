<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# Frontend (React) 담당 업무 정리

# 🖥 Frontend 역할

Frontend는 사용자가 직접 보는 **웹 화면(UI)** 을 제작하고,

Backend API와 연결하여 데이터를 받아와 화면에 출력하는 역할을 담당합니다.

즉, 서비스의 **사용자 경험(UI/UX)** 을 책임지는 파트입니다.

---

## 🛠 Tech Stack

- React
- JavaScript
- CSS
- Axios
- React Router

---

# 📄 페이지 구성

## 1. 로그인 페이지

### 기능

- 학번 입력
- 로그인 버튼
- 로그인 성공 시 메인 페이지 이동

### API 연결

```
POST /login
```

---

## 2. 메인 페이지

### 기능

- 서비스 소개
- 메뉴 이동

### 이동 메뉴

- 빈 강의실 찾기
- 열람실 좌석 보기
- 관리자 페이지 (admin만)

---

## 3. 빈 강의실 조회 페이지

### 기능

- 요일 선택
- 시간 선택
- 조회 버튼

### 결과 출력

- 사용 가능한 강의실 목록
- 강의실 상태 표시

### 예시

```
공1201 [비어있음]
공1202 [공부중]
공1203 [팀플중]
```

### API 연결

```
GET /classrooms/empty?day=MON&time=13:00
```

---

## 4. 강의실 상세 / 상태 등록

### 기능

강의실 클릭 시:

- 공부중 등록
- 휴식중 등록
- 팀플중 등록
- 사용 종료

### API 연결

```
POST /room-usage/start
POST /room-usage/end
```

---

## 5. 열람실 좌석 페이지

### 기능

- 좌석 전체 조회
- 좌석 상태 색상 표시
- 좌석 클릭 후 사용 시작 / 종료

### 상태 예시

```
초록 = 빈자리
파랑 = 사용중
회색 = 자리비움
```

### API 연결

```
GET /seats
POST /seats/use
POST /seats/away
POST /seats/end
```

---

## 6. 관리자 페이지

### 기능

- 시간표 목록 조회
- 시간표 등록
- 시간표 수정
- 시간표 삭제

### 입력 항목

- 강의실
- 요일
- 시작 시간
- 종료 시간
- 강의명
- 교수명

### API 연결

```
GET /schedules
POST /schedules
PUT /schedules/:id
DELETE /schedules/:id
```

---

# 🧩 프론트 핵심 개발 요소

## 상태 관리

- 로그인 사용자 정보 저장
- 조회 결과 목록 저장
- 좌석 상태 저장

## 페이지 이동

- React Router 사용

```
/login
/main
/rooms
/seats
/admin
```

## API 통신

- Axios 사용

---

# 🎯 우선순위 개발 순서

## 1단계

- 페이지 레이아웃 제작

## 2단계

- 라우터 연결

## 3단계

- API 연결

## 4단계

- 디자인 개선

---

# 📌 Design Notes

- 사용자가 한눈에 상태를 볼 수 있도록 색상 UI 적용
- 모바일/PC 반응형 고려 가능
- 직관적인 버튼 배치
- 교수 시연용으로 깔끔한 화면 구성 중요

---

# 한 줄 요약

Frontend는 React를 이용해 화면을 만들고,

Backend API와 연결하여 사용자가 실제로 사용하는 서비스를 완성하는 역할입니다.
>>>>>>> a1cdfe68d701592594529459ad17efb71bcb4da1
