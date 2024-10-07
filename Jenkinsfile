pipeline {
    agent any

    environment {
        // Git 리포지토리 설정
        GIT_REPO = 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103.git' // GitLab 소스 코드 리포지토리
        GIT_CREDENTIALS_ID = 'stackup-gitlab' // Jenkins에 설정한 GitLab 자격 증명 ID (gitlab_token)

        // GitHub 리포지토리 설정 (매니페스트)
        GITHUB_REPO = 'https://github.com/S-Choi-1997/stackupM-manifests.git' // GitHub 매니페스트 리포지토리
        GITHUB_CREDENTIALS_ID = 'stackupM' // Jenkins에 설정한 GitHub 자격 증명 ID (stackupM-github)

        // Docker Hub 설정
        DOCKER_HUB_CREDENTIALS_ID = 'stackup-docker' // Jenkins에 설정한 Docker Hub 자격 증명 ID (stackup-docker)
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_TAG = "${env.BUILD_NUMBER}" // 빌드 번호를 이미지 태그로 사용

        // Kubernetes 설정
        K8S_NAMESPACE = 'default' // 배포할 Kubernetes 네임스페이스

        // Argo CD 설정
        ARGOCD_SERVER = 'http://34.64.46.226:30081' // 실제 Argo CD 서버 주소 및 NodePort
        ARGOCD_CREDENTIALS_ID = 'argocd-password' // Jenkins에 설정한 Argo CD 자격 증명 ID (argocd-password)
    }

    stages {
        stage('Checkout') {
            steps {
                // be/msa 브랜치 체크아웃
                git branch: 'be/msa', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('Build User Docker Image') {
            when {
                changeset "**/backend/user/**"
            }
            steps {
                buildDockerImage('user', "${DOCKER_REGISTRY}/choho97/stackup/user:${IMAGE_TAG}")
            }
        }

        stage('Build Board Docker Image') {
            when {
                changeset "**/backend/board/**"
            }
            steps {
                buildDockerImage('board', "${DOCKER_REGISTRY}/choho97/stackup/board:${IMAGE_TAG}")
            }
        }

        stage('Build Account Docker Image') {
            when {
                changeset "**/backend/account/**"
            }
            steps {
                buildDockerImage('account', "${DOCKER_REGISTRY}/choho97/stackup/account:${IMAGE_TAG}")
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
        dir("backend/${project}") { // 정확한 디렉토리 경로로 수정
            // gradlew 파일에 실행 권한 부여
            sh 'chmod +x ./gradlew'
            // Gradle 빌드 실행
            sh './gradlew clean build -x test'

            // Docker 이미지 빌드 및 푸시
            dockerImage = docker.build(imageName)
            docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_HUB_CREDENTIALS_ID}") {
                dockerImage.push()
            }

            // GitHub 매니페스트 업데이트
            dir("../../manifests/${project}") { // 매니페스트 리포지토리 디렉토리로 이동
                // GitHub 매니페스트 리포지토리 체크아웃
                git branch: 'main', url: "${GITHUB_REPO}", credentialsId: "${GITHUB_CREDENTIALS_ID}"

                // Deployment 매니페스트의 이미지 태그 업데이트
                sh """
                    sed -i 's|image: choho97/stackup/${project}:.*|image: choho97/stackup/${project}:${IMAGE_TAG}|' deployment.yaml
                """

                // Git 사용자 설정 및 변경 사항 커밋 & 푸시
                sh """
                    git config user.email "jenkins@example.com"
                    git config user.name "jenkins"
                    git add deployment.yaml
                    git commit -m "Update image to choho97/stackup/${project}:${IMAGE_TAG}"
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
