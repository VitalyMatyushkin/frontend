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
                sh 'npm install'
                //sh 'npm run deploy'
            }
        }

        stage('Debug') {
            steps {
                print 'DEBUG: params are = ' + params
                sh 'printenv'
            }
        }

        if(params.SCENARIO == 'build-deploy-stage1') {
            stage('Deploy-Stage1') {
                        agent { label 'stage1-deploy' }

                        when {
                            expression { params.SCENARIO == 'build-deploy-stage1' }
                        }
                        steps {
                            print 'deploying..'
                        }
                    }
        }

    }
}