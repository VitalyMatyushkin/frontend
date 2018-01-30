pipeline {
    agent { label 'node' }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run deploy'
            }
        }
    }
}