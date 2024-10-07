pipeline {
    agent any

    environment {
        // Git 리포지토리 설정
        GIT_REPO = 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103.git' // GitLab 소스 코드 리포지토리
        GIT_CREDENTIALS_ID = 'stackup-gitlab' // Jenkins에 설정한 GitLab 자격 증명 ID (gitlab_token)

        // GitHub 리포지토리 설정 (매니페스트)
        GITHUB_REPO = 'https://github.com/S-Choi-1997/stackupM.git' // GitHub 매니페스트 리포지토리
        GITHUB_CREDENTIALS_ID = 'stackup_github' // Jenkins에 설정한 GitHub 자격 증명 ID (stackupM-github)

        // Docker Hub 설정
        DOCKER_HUB_CREDENTIALS_ID = 'stackup_docker' // Jenkins에 설정한 Docker Hub 자격 증명 ID (stackup-docker)
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // 빌드 번호를 이미지 태그로 사용

        // Kubernetes 설정
        K8S_NAMESPACE = 'default' // 배포할 Kubernetes 네임스페이스

        // Argo CD 설정
        ARGOCD_SERVER = 'http://34.64.46.226:30081' // 실제 Argo CD 서버 주소 및 NodePort
        ARGOCD_CREDENTIALS_ID = 'stackup_argo' // Jenkins에 설정한 Argo CD 자격 증명 ID (argocd-password)

        // 추가한 환경변수들
        AWS_ACCESS_KEY_ID = 'AKIAYS2NQJX3RYCARFUQ'
        AWS_SECRET_ACCESS_KEY = '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'
        DB_PASSWORD = '1q2w3e4r!'
        DB_URL = 'jdbc:mysql://34.22.93.211:3306/stackup'
        DB_USERNAME = 'root'
        ELASTIC_URL = 'http://34.47.84.173:9200/'
        GITHUB_ID = 'Iv23li51nY1w8lyOBlai'
        GITHUB_SECRET = 'c2cd01f968c1d38a9b528cece96b3de94ab43733'
        PUBLIC_DATA_PORTAL_API_KEY = 'npc0/ueEMOagYro4kXt4rObYM1FEIbIV/UvVUHM5zG2K9E4zl2cEFx3uvkJfM13LxXPrJG2jYh/I9mZoxbB8ig=='
        PUBLIC_DATA_PORTAL_API_URL = 'https://api.odcloud.kr/api/nts-businessman/v1/status'
        REDIS_IP = '34.64.42.43'
        REDIS_PASSWORD = 'I9JR5oaodA'
        S3_BUCKET = 'worqbucket'
        SECRET = 'uw5YoYHImqUhahQfNWU7VZpPrZ2pQx4kyN6hQkztIiJN/CMfhjnBwcVW3ccDud2e3Dq/xzeCvF4kQ2YUt5Ncpg=='
        SECRET_ACCOUNT_KEY = 'vBpCYu3TdmWmcBc='
    }

    stages {
        stage('Checkout') {
            steps {
                // GitLab 레포지토리에서 소스 코드 체크아웃
                git branch: 'be/cd', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('List Root Files') {
            steps {
                // 현재 디렉터리의 파일 목록 출력 (디버깅용)
                sh 'echo "Listing files in the root directory:"'
                sh 'ls -la'
            }
        }

        stage('Build and Push Docker Images') {
            parallel {
                stage('Build User Docker Image') {
                    steps {
                        script {
                            buildDockerImage('user', "choho97/stackup-user:${IMAGE_TAG}")
                        }
                    }
                }

                stage('Build Board Docker Image') {
                    steps {
                        script {
                            buildDockerImage('board', "choho97/stackup-board:${IMAGE_TAG}")
                        }
                    }
                }

                stage('Build Account Docker Image') {
                    steps {
                        script {
                            buildDockerImage('account', "choho97/stackup-account:${IMAGE_TAG}")
                        }
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

// Docker 이미지 빌드 및 푸시 함수 정의
def buildDockerImage(project, imageName) {
    script {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            // Docker Hub에 로그인
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'

            dir("backend/${project}") { // 프로젝트별 디렉터리로 이동
                // 디렉터리 내용 출력 (디버깅용)
                sh 'echo "Listing files in $(pwd)"'
                sh 'ls -la'

                // Gradle 빌드 실행 (테스트 제외)
                sh 'chmod +x ./gradlew'
                sh './gradlew clean build -x test --stacktrace'

                // 빌드 후 JAR 파일 위치 확인 (디버깅용)
                sh 'ls -la build/libs/'

                // Docker 이미지 빌드 및 푸시 (Dockerfile을 명시적으로 참조)
                sh """
                    docker build -t ${imageName} -f Dockerfile .
                    docker push ${imageName}
                """
            }
            // GitHub 리포지토리 체크아웃
            git branch: 'main', url: "${GITHUB_REPO}", credentialsId: "${GITHUB_CREDENTIALS_ID}"
            // GitHub 매니페스트 업데이트 및 ArgoCD 동기화
            dir("spring-${project}") { //
                // 이미지 태그 업데이트
                sh """
                    sed -i 's|image: choho97/stackup-${project}:.*|image: choho97/stackup-${project}:${IMAGE_TAG}|' deployment.yaml
                """

                // 변경 사항 커밋 및 푸시
                sh """
                    git config user.email "jenkins@example.com"
                    git config user.name "jenkins"
                    git add deployment.yaml kustomization.yaml service.yaml
                    git commit -m "Update image to choho97/stackup-${project}:${IMAGE_TAG}"|| echo "No changes to commit"
                """
                // GitHub에 푸시 - 자격 증명 사용
                withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                        git push https://$GIT_USER:$GIT_PASS@github.com/S-Choi-1997/stackupM.git main --force
                    """
                }

                // Argo CD Sync
                withCredentials([usernamePassword(credentialsId: "${ARGOCD_CREDENTIALS_ID}", usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                    sh """
                        argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USER} --password ${ARGOCD_PASS} --insecure
                        argocd app sync ${project}
                    """
                }
            }
        }
    }
}
