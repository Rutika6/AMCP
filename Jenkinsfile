pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    // Give each build its own Compose project namespace. This pipeline builds
    // images only, but the namespace also makes cleanup safe if services are
    // added to the pipeline later.
    environment {
        COMPOSE_PROJECT_NAME = "teamup-ci-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Project') {
            steps {
                bat '''
                    if not exist "docker-compose.yml" (echo Missing docker-compose.yml & exit /b 1)
                    if not exist "frontend/teamup-frontend/Dockerfile" (echo Missing frontend Dockerfile & exit /b 1)
                    if not exist "frontend/teamup-frontend/package.json" (echo Missing frontend package.json & exit /b 1)
                    if not exist "backend/teamup-backend/Dockerfile" (echo Missing backend Dockerfile & exit /b 1)
                    if not exist "backend/teamup-backend/package.json" (echo Missing backend package.json & exit /b 1)
                    echo TeamUp project structure is valid.
                '''
            }
        }

        stage('Validate Docker Compose') {
            steps {
                bat 'docker compose config --quiet'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker compose build'
            }
        }
    }

    post {
        always {
            echo 'Cleanup: removing any containers and networks for this CI Compose project.'
            script {
                def cleanupStatus = bat(returnStatus: true, script: 'docker compose down --remove-orphans')
                if (cleanupStatus != 0) {
                    echo "Compose cleanup returned ${cleanupStatus}; no containers are started by the build stage."
                }
            }
        }
        success {
            echo 'TeamUp CI succeeded: project validation, Compose validation, and Docker image build passed.'
        }
        failure {
            echo 'TeamUp CI failed. Review the first failed stage in the Jenkins console output.'
        }
    }
}
