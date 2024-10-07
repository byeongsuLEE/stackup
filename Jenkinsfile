pipeline {
    agent any

    environment {
        // Git 리포지토리 설정
        GIT_REPO = 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103.git' // GitLab 소스 코드 리포지토리
        GIT_CREDENTIALS_ID = 'stackup-gitlab' // Jenkins에 설정한 GitLab 자격 증명 ID (gitlab_token)

        // GitHub 리포지토리 설정 (매니페스트)
        GITHUB_REPO = 'https://github.com/S-Choi-1997/stackupM-manifests.git' // GitHub 매니페스트 리포지토리
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
    }

    stages {
        stage('Checkout') {
            steps {
                // be/cd 브랜치 체크아웃
                git branch: 'be/cd', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('Build Project') {
            steps {
                script {
                    // 전체 프로젝트 루트에서 Gradle 빌드 실행
                    sh 'chmod +x ./gradlew' // gradlew 실행 권한 부여
                    sh './gradlew clean build -x test --stacktrace'
                }
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

            dir("backend/${project}") { // 프로젝트별 Dockerfile이 위치한 디렉터리로 이동
                // 디렉터리 내용 출력 (디버깅용)
                sh 'echo "Listing files in $(pwd)"'
                sh 'ls -la'

                // Docker 이미지 빌드 및 푸시 (Dockerfile을 명시적으로 참조)
                sh """
                    docker build -t ${imageName} -f Dockerfile .
                    docker push ${imageName}
                """
            }

            // GitHub 매니페스트 업데이트 및 ArgoCD 동기화
            dir("manifests/${project}") {
                git branch: 'main', url: "${GITHUB_REPO}", credentialsId: "${GITHUB_CREDENTIALS_ID}"
                sh """
                    sed -i 's|image: choho97/stackup-${project}:.*|image: choho97/stackup-${project}:${IMAGE_TAG}|' deployment.yaml
                    git config user.email "jenkins@example.com"
                    git config user.name "jenkins"
                    git add deployment.yaml
                    git commit -m "Update image to choho97/stackup-${project}:${IMAGE_TAG}"
                    git push origin main
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
