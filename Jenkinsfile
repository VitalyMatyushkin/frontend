pipeline {
    agent { label 'node' }

    parameters {
        choice(
            choices: 'build-only\nbuild-deploy-stage1',
            description: 'what to do with this build',
            name: 'SCENARIO'
        )
    }

    stages {
        stage('Build') {
            steps {
                //sh 'npm install'
                //sh 'npm run deploy'
                print 'build..'
            }
        }

        stage('Debug') {
            steps {
                print 'DEBUG: params are = ' + params
                sh 'printenv'
            }
        }


        stage('Deploy-Stage1') {
            steps {
                if(params.SCENARIO == 'build-deploy-stage1') {
                    node('stage1-deploy') {
                        print 'on stage1!'
                    }
                }
            }
        }

    }
}