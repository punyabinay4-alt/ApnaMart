pipeline {
    agent any
    
    stages {
        stage('Frontend Build') {
            steps {
                echo 'Building Frontend (React)...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Backend Dependencies') {
            steps {
                echo 'Installing Backend (Node.js) dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Success') {
            steps {
                echo 'ApnaMart Full-Stack Pipeline Build Successful!'
            }
        }
    }
}
