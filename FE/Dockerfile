# 1. Node.js 이미지 선택 (최신 버전 사용)
FROM node:20.10.0

# 2. 작업 디렉토리 생성 및 설정
WORKDIR /LLMN

# 3. package.json과 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev  # production 환경에서는 devDependencies 제외

# 4. 소스 코드 전체 복사
COPY . .

# 5. 환경 변수 파일 복사
COPY .env.local .env.local

# 6. TypeScript 프로젝트 빌드
RUN npm run build

# 7. Next.js 서버가 사용하는 포트 노출
EXPOSE 3000

# 8. 컨테이너 시작 시 실행할 명령어 (프로덕션 모드)
CMD ["npm", "start"]
