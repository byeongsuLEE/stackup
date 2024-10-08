pipeline {
    agent any

    environment {
        // Git 리포지토리 설정
        GIT_REPO = 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103.git'
        GIT_CREDENTIALS_ID = 'stackup-gitlab'

        // GitHub 리포지토리 설정 (매니페스트)
        GITHUB_REPO = 'https://github.com/S-Choi-1997/stackupM.git'
        GITHUB_CREDENTIALS_ID = 'stackup_github'

        // Docker Hub 설정
        DOCKER_HUB_CREDENTIALS_ID = 'stackup_docker'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // 빌드 번호를 이미지 태그로 사용

        // Kubernetes 매니페스트 경로
        MANIFESTS_PATH = 'manifests/Spring-frontend' // GitHub 리포지토리 내 매니페스트 경로
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Git 리포지토리에서 소스 코드 체크아웃
                git branch: 'dev/fe', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    // npm 의존성 설치
                    sh 'npm install'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir('frontend') {
                    // React 애플리케이션 빌드
                    sh 'npm run build'
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // Docker Hub에 로그인
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                        echo "Building Docker image: choho97/stackup-frontend:${IMAGE_TAG}"
                        // Docker 이미지 빌드
                        sh "docker build -t choho97/stackup-frontend:${IMAGE_TAG} -f frontend/Dockerfile ."
                        // Docker 이미지 푸시
                        sh "docker push choho97/stackup-frontend:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        // GitHub 매니페스트 리포지토리 클론
                        sh """
                            git clone -b main https://${GIT_USER}:${GIT_PASS}@github.com/S-Choi-1997/stackupM.git
                            cd stackupM/${MANIFESTS_PATH}
                        """

                        // 현재 디렉터리의 파일 목록 출력 (디버깅용)
                        sh 'echo "Listing files in Spring-frontend directory:"'
                        sh 'ls -la'

                        // deployment.yaml 파일의 이미지 태그 업데이트
                        sh "sed -i 's|image: choho97/stackup-frontend:.*|image: choho97/stackup-frontend:${IMAGE_TAG}|' deployment.yaml"

                        // Git 설정 및 커밋
                        sh """
                            git config user.email "jenkins@example.com"
                            git config user.name "jenkins"
                            git add deployment.yaml
                            git commit -m "Update image to choho97/stackup-frontend:${IMAGE_TAG}" || echo "No changes to commit"
                        """

                        // 변경 사항 GitHub에 푸시
                        sh "git push https://${GIT_USER}:${GIT_PASS}@github.com/S-Choi-1997/stackupM.git main"
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment process completed successfully!'
        }
        failure {
            echo 'Build or deployment process failed.'
        }
    }
}
