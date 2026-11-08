pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/punyabinay4-all/ApnaMart'
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                // sh 'npm install'
            }
        }
        stage('Build Application') {
            steps {
                echo 'Building ApanaMart application...'
                // sh 'npm run build'
            }
        }
    }
}
