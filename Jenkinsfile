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
                git branch: 'be/msa-user', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
                sh "pwd"
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

        stage('Build and Push Docker Images') {
            parallel {
                stage('Build User Docker Image') {
                    when {
                        changeset "**/backend/user/**"
                    }
                    steps {
                        script {
                            buildDockerImage('user', "choho97/stackup-user:${IMAGE_TAG}")
                        }
                    }
                }

                stage('Build Board Docker Image') {
                    when {
                        changeset "**/backend/board/**"
                    }
                    steps {
                        script {
                            buildDockerImage('board', "choho97/stackup-board:${IMAGE_TAG}")
                        }
                    }
                }

                stage('Build Account Docker Image') {
                    when {
                        changeset "**/backend/account/**"
                    }
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
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend(color: 'good',
                    message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                    endpoint: 'https://meeting.ssafy.com/hooks/ctjpiwrc3386fcqerphr5fquxr',
                    channel: 'BuildTest'
                        )
            }
        }
        failure {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend(color: 'danger',
                    message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                    endpoint: 'https://meeting.ssafy.com/hooks/ctjpiwrc3386fcqerphr5fquxr',
                    channel: 'BuildTest'
                        )
            }
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
        withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'

            echo "Image name: ${imageName}"

            dir("backend/${project}") {
                sh 'chmod +x ./gradlew'
                sh './gradlew clean build -x test --stacktrace'
                sh "docker build -t ${imageName} -f Dockerfile ."
                sh "docker push ${imageName}"
            }
            
            // GitHub 리포지토리 체크아웃과 푸시 작업에 락을 적용
            lock(resource: 'git-push') {
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
                    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh """
                            pwd
                            git pull --rebase https://$GIT_USER:$GIT_PASS@github.com/S-Choi-1997/stackupM.git main
                        """
                    }

                    // 이미지 태그 업데이트 및 기타 작업 수행
                    sh """
                        sed -i 's|image: choho97/stackup-${project}:.*|image: choho97/stackup-${project}:${IMAGE_TAG}|' deployment.yaml
                        cat deployment.yaml
                        git config user.email "jenkins@example.com"
                        git config user.name "jenkins"
                    """

                    // 한 단계 상위 디렉터리로 이동 후 GitHub에 푸시
                    dir('..') {
                        sh "git diff"
                        sh "pwd"
                        sh "ls"
                        
                        // 변경 사항을 스테이징하고 커밋한 후 푸시
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
