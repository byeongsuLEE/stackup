pipeline {
    agent any

    environment {
        GIT_REPO = 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103.git'
        GIT_CREDENTIALS_ID = 'stackup-gitlab'
        GITHUB_REPO = 'https://github.com/S-Choi-1997/stackupM.git'
        GITHUB_CREDENTIALS_ID = 'stackup_github'
        DOCKER_HUB_CREDENTIALS_ID = 'stackup_docker'
        IMAGE_NAME = 'choho97/stackup-flask'  // docker.io 제거
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        K8S_NAMESPACE = 'default'
        ARGOCD_SERVER = '34.64.46.226:30081'
        ARGOCD_CREDENTIALS_ID = 'stackup_argo'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'dev/ml', url: "${GIT_REPO}", credentialsId: "${GIT_CREDENTIALS_ID}"
            }
        } 

        stage('Install ArgoCD CLI') {
            steps {
                sh """
                    curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
                    chmod +x argocd-linux-amd64
                    mv argocd-linux-amd64 /usr/local/bin/argocd
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."  // docker.io 제거
                        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"  // docker.io 제거
                    }
                }
            }
        }

        stage('Update Kubernetes Manifests') {
    steps {
        script {
            withCredentials([usernamePassword(credentialsId: 'stackup_github', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                git branch: 'main', url: "${GITHUB_REPO}", credentialsId: "${GITHUB_CREDENTIALS_ID}"
                
                // 매니페스트 파일 수정
                dir('flask') {
                    sh """
                    sed -i 's|image: choho97/flask-flask:.*|image: choho97/stackup-flask:${IMAGE_TAG}|' deployment.yaml
                    """
                }
                
                // 변경된 파일의 차이를 출력
                sh """
                    echo "Checking for changes in the repository:"
                    git diff
                """
                
                // Git 커밋 및 푸시
                sh """
                    git config user.email "jenkins@company.com"
                    git config user.name "Jenkins CI"
                    git add flask/deployment.yaml
                    git commit -m 'Update image to choho97/stackup-flask:${IMAGE_TAG}' || echo "No changes to commit"
                    git push https://$GIT_USER:$GIT_PASS@github.com/S-Choi-1997/stackupM.git main
                """
            }
        }
    }
}


        stage('Deploy to Kubernetes with Argo CD') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${ARGOCD_CREDENTIALS_ID}", usernameVariable: 'ARGOCD_USER', passwordVariable: 'ARGOCD_PASS')]) {
                        sh """
                        echo y | /usr/local/bin/argocd login ${ARGOCD_SERVER} --username ${ARGOCD_USER} --password ${ARGOCD_PASS} --insecure
                        /usr/local/bin/argocd app sync flask
                        """
                    }
                }
            }
        }

    }

    post {
        success {
            echo 'Build, manifest update, and deployment completed successfully!'
        }
        failure {
            echo 'Process failed.'
        }
    }
}
