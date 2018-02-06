pipeline {
    agent { label 'node' }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                //sh 'npm run deploy'
            }
        }

        stage('Speak') {
            steps {
                print 'DEBUG: parameter isFoo = ' + params.isFoo
            }
        }
    }
}