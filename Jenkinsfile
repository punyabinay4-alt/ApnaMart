pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'GitHub se latest code fetch ho raha hai...'
                sh 'ls -la'
            }
        }

        stage('Build Frontend & Backend (Docker)') {
            steps {
                echo 'ApnaMart ke Docker images build ho rahe hain...'
                sh 'docker-compose build'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Purane containers stop karke naya version start ho raha hai...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }

        stage('Verify Status') {
            steps {
                echo 'Running containers check ho rahe hain...'
                sh 'docker ps'
                echo 'ApnaMart Successfully Deploy Ho Gaya!'
            }
        }
    }
}
