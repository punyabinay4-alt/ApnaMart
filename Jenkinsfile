pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking workspace files...'
                sh 'ls -la'
            }
        }

        stage('Build & Deploy (Docker)') {
            steps {
                echo 'Deploying ApnaMart using Docker Compose...'
                sh 'docker compose build'
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }

        stage('Verify Status') {
            steps {
                sh 'docker ps'
                echo 'ApnaMart Successfully Deployed!'
            }
        }
    }
}
