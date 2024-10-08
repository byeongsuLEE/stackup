pipeline {
    agent any

    environment {
        GIT_REPO = 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C103.git'
        GIT_CREDENTIALS_ID = 'stackup-gitlab'
        GITHUB_REPO = 'https://github.com/S-Choi-1997/stackupM.git'
        GITHUB_CREDENTIALS_ID = 'stackup_github'
        DOCKER_HUB_CREDENTIALS_ID = 'stackup_docker'
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_NAME = 'choho97/stackup-flask'
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
                        sh "docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ."
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'stackup_github', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        git branch: 'main', url: "${GITHUB_REPO}", credentialsId: "${GITHUB_CREDENTIALS_ID}"
                        dir('flask') {
                            sh """
                            sed -i 's|image: docker.io/choho97/flask-app:.*|image: docker.io/choho97/stackup-flask:${IMAGE_TAG}|' deployment.yaml
                            """
                        }
                        sh """
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
