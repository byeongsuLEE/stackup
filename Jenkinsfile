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
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_TAG = "${env.BUILD_NUMBER}"

        // Kubernetes 설정
        K8S_NAMESPACE = 'default'

        // Argo CD 설정
        ARGOCD_SERVER = '34.64.46.226:30081'
        ARGOCD_CREDENTIALS_ID = 'stackup_argo'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'be/cd', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        }

        stage('List Root Files') {
            steps {
                sh 'echo "Listing files in the root directory:"'
                sh 'ls -la'
            }
        }

        stage('Install ArgoCD CLI') {
            steps {
                sh """
                    curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
                    chmod +x argocd-linux-amd64
                    mv argocd-linux-amd64 ./argocd
                """
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
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
        // 빌드 후 임시 파일 정리
        cleanup {
            sh 'rm -rf spring-user@tmp/'
            sh 'rm -rf spring-frontend@tmp/'
            sh 'rm -rf spring-board@tmp/'
            echo 'Temporary files cleaned up.'
        }
    }
}

// Docker 이미지 빌드 및 푸시 함수 정의
def buildDockerImage(project, imageName) {
    script {
        lock(resource: 'git-push') {  // Git 작업을 위한 락 설정
            withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                // GitHub 리포지토리 체크아웃
                git branch: 'main', url: "${GITHUB_REPO}", credentialsId: "${GITHUB_CREDENTIALS_ID}"

                // spring-${project} 디렉터리로 이동해서 작업
                dir("spring-${project}") {
                    // 로컬 변경 사항을 커밋 또는 스태시
                    sh """
                        git add .
                        git commit -m "Auto-commit before pulling changes" || echo "No changes to commit"
                    """

                    // 원격 저장소에서 변경 사항을 가져옴 (rebase 사용)
                    sh """
                        pwd
                        git pull --rebase https://$GIT_USER:$GIT_PASS@github.com/S-Choi-1997/stackupM.git main
                    """

                    // 이미지 태그 업데이트 및 기타 작업 수행
                    sh """
                        sed -i 's|image: choho97/stackup-${project}:.*|image: choho97/stackup-${project}:${IMAGE_TAG}|' deployment.yaml
                        cat deployment.yaml
                        git config user.email "jenkins@example.com"
                        git config user.name "jenkins"
                    """

                    // 한 단계 상위 디렉터리로 이동 후 GitHub에 푸시
                    dir('..') {
                        withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                            sh """
                                git add spring-${project}/deployment.yaml spring-${project}/kustomization.yaml spring-${project}/service.yaml
                                git commit -m "Update image to choho97/stackup-${project}:${IMAGE_TAG}" || echo "No changes to commit"
                                git push https://$GIT_USER:$GIT_PASS@github.com/S-Choi-1997/stackupM.git main
                            """
                        }
                    }
                }
            }

            // Docker 이미지 빌드 및 푸시
            dir("backend/spring-${project}") {
                sh "ls"
                sh "pwd"
                sh 'chmod +x ./gradlew'
                sh './gradlew clean build -x test --stacktrace'
                sh "docker build -t ${imageName} -f Dockerfile ."
                sh "docker push ${imageName}"
            }

            // Argo CD Sync
            def appName = "spring-${project}"
            withCredentials([usernamePassword(credentialsId: "${ARGOCD_CREDENTIALS_ID}", usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                sh """
                    echo y | ./argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USER} --password ${ARGOCD_PASS} --insecure
                    ./argocd app sync ${appName}
                """
            }
        }
    }
}
