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
                sh 'npm run deploy'
                stash name: 'web', includes: 'build/*, dist/*, docs/*, images/*, Fonts/*, fonts/*, favicon.ico, index.html, VERSION.txt, cookies_policy_v1.0.docx'
            }
        }

        stage('Deploy-Stage1') {
            when {
                expression { params.SCENARIO == 'build-deploy-stage1' }
            }
            steps {
                node('stage1-deploy') {
                    print 'on stage1!'
                    dir('/home/squad/stage1/frontend2') {
                        unstash 'web'
                    }
                }
            }
        }

    }
}