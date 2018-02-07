// will be removed in future releases in favour of zjenkins dir

pipeline {
    agent { label 'node' }
    stages {
        stage('build') {
            steps {
                sh 'npm install'
                sh 'npm run deploy'
            }
        }
    }
}