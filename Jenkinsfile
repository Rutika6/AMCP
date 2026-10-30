pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    // Give each build its own Compose project namespace. This pipeline builds
    // images only, but the namespace also makes cleanup safe if services are
    // added to the pipeline later.
    environment {
        COMPOSE_PROJECT_NAME = "teamup-ci-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Project') {
            steps {
                bat '''
                    if not exist "docker-compose.yml" (echo Missing docker-compose.yml & exit /b 1)
                    if not exist "frontend/teamup-frontend/Dockerfile" (echo Missing frontend Dockerfile & exit /b 1)
                    if not exist "frontend/teamup-frontend/package.json" (echo Missing frontend package.json & exit /b 1)
                    if not exist "backend/teamup-backend/Dockerfile" (echo Missing backend Dockerfile & exit /b 1)
                    if not exist "backend/teamup-backend/package.json" (echo Missing backend package.json & exit /b 1)
                    echo TeamUp project structure is valid.
                '''
            }
        }

        stage('Locate Docker CLI') {
            steps {
                script {
                    def dockerDir = bat(returnStdout: true, script: '''
                        @echo off
                        powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "$candidates = New-Object 'System.Collections.Generic.List[string]'; $onPath = Get-Command docker.exe -ErrorAction SilentlyContinue; if ($onPath) { $candidates.Add($onPath.Source) }; if ($env:DOCKER_CLI_DIR) { $candidates.Add((Join-Path $env:DOCKER_CLI_DIR 'docker.exe')) }; if ($env:ProgramFiles) { $candidates.Add((Join-Path $env:ProgramFiles 'Docker/Docker/resources/bin/docker.exe')) }; if ($env:LOCALAPPDATA) { $candidates.Add((Join-Path $env:LOCALAPPDATA 'Programs/DockerDesktop/resources/bin/docker.exe')) }; $usersRoot = Join-Path $env:SystemDrive 'Users'; $profiles = Get-ChildItem -LiteralPath $usersRoot -Directory -ErrorAction SilentlyContinue; foreach ($profile in $profiles) { $candidates.Add((Join-Path $profile.FullName 'AppData/Local/Programs/DockerDesktop/resources/bin/docker.exe')) }; $dockerExe = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1; if (-not $dockerExe) { Write-Error 'Docker CLI was not found. Set DOCKER_CLI_DIR for the Jenkins service or add Docker Desktop resources/bin to its PATH.'; exit 1 }; Split-Path -Parent $dockerExe"
                    ''').trim()

                    env.PATH = "${dockerDir};${env.PATH}"
                    echo "Using Docker CLI directory: ${dockerDir}"
                    bat 'docker --version'

                    def dockerComposeStatus = bat(returnStatus: true, script: 'docker compose version')
                    if (dockerComposeStatus == 0) {
                        env.TEAMUP_COMPOSE_COMMAND = 'docker compose'
                    } else {
                        echo 'Docker Compose is not available as a Docker CLI plugin. Searching standalone and plugin locations.'
                        def composeExe = bat(returnStdout: true, script: '''
                            @echo off
                            powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "$candidates = @(); $checked = @(); $onPath = Get-Command docker-compose.exe -ErrorAction SilentlyContinue; if ($onPath) { $candidates += $onPath.Source } else { $checked += 'PATH lookup for docker-compose.exe' }; $docker = Get-Command docker.exe -ErrorAction SilentlyContinue; if ($docker) { $dockerBin = Split-Path -Parent $docker.Source; $dockerResources = Split-Path -Parent $dockerBin; $candidates += (Join-Path $dockerResources 'cli-plugins/docker-compose.exe'); $candidates += (Join-Path $dockerBin 'cli-plugins/docker-compose.exe'); $checked += (Join-Path $dockerResources 'cli-plugins/docker-compose.exe'); $checked += (Join-Path $dockerBin 'cli-plugins/docker-compose.exe') }; if ($env:DOCKER_CLI_DIR) { $candidates += (Join-Path $env:DOCKER_CLI_DIR 'docker-compose.exe'); $candidates += (Join-Path $env:DOCKER_CLI_DIR 'cli-plugins/docker-compose.exe'); $checked += (Join-Path $env:DOCKER_CLI_DIR 'docker-compose.exe'); $checked += (Join-Path $env:DOCKER_CLI_DIR 'cli-plugins/docker-compose.exe') }; if ($env:ProgramFiles) { $candidates += (Join-Path $env:ProgramFiles 'Docker/Docker/resources/cli-plugins/docker-compose.exe'); $candidates += (Join-Path $env:ProgramFiles 'Docker/Docker/resources/bin/docker-compose.exe'); $candidates += (Join-Path $env:ProgramFiles 'Docker/Docker/cli-plugins/docker-compose.exe'); $checked += (Join-Path $env:ProgramFiles 'Docker/Docker/resources/cli-plugins/docker-compose.exe'); $checked += (Join-Path $env:ProgramFiles 'Docker/Docker/resources/bin/docker-compose.exe'); $checked += (Join-Path $env:ProgramFiles 'Docker/Docker/cli-plugins/docker-compose.exe') }; if ($env:LOCALAPPDATA) { $candidates += (Join-Path $env:LOCALAPPDATA 'Programs/DockerDesktop/resources/cli-plugins/docker-compose.exe'); $candidates += (Join-Path $env:LOCALAPPDATA 'Programs/DockerDesktop/resources/bin/docker-compose.exe'); $checked += (Join-Path $env:LOCALAPPDATA 'Programs/DockerDesktop/resources/cli-plugins/docker-compose.exe'); $checked += (Join-Path $env:LOCALAPPDATA 'Programs/DockerDesktop/resources/bin/docker-compose.exe') }; if ($env:ProgramData) { $candidates += (Join-Path $env:ProgramData 'DockerDesktop/version-bin/docker-compose.exe'); $checked += (Join-Path $env:ProgramData 'DockerDesktop/version-bin/docker-compose.exe') }; if ($env:USERPROFILE) { $candidates += (Join-Path $env:USERPROFILE '.docker/cli-plugins/docker-compose.exe'); $checked += (Join-Path $env:USERPROFILE '.docker/cli-plugins/docker-compose.exe') }; $usersRoot = Join-Path $env:SystemDrive 'Users'; $profiles = Get-ChildItem -LiteralPath $usersRoot -Directory -ErrorAction SilentlyContinue; foreach ($profile in $profiles) { $profilePlugin = Join-Path $profile.FullName '.docker/cli-plugins/docker-compose.exe'; $candidates += $profilePlugin; $checked += $profilePlugin }; $composeExe = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1; if (-not $composeExe) { Write-Error ('Docker Compose was not found. Checked: ' + ($checked -join '; ')); exit 1 }; $composeExe"
                        ''').trim()
                        env.TEAMUP_COMPOSE_COMMAND = '"' + composeExe + '"'
                    }

                    bat '%TEAMUP_COMPOSE_COMMAND% version'
                    env.TEAMUP_COMPOSE_READY = 'true'
                }
            }
        }

        stage('Validate Docker Compose') {
            steps {
                bat '%TEAMUP_COMPOSE_COMMAND% config --quiet'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat '%TEAMUP_COMPOSE_COMMAND% build'
            }
        }
    }

    post {
        always {
            script {
                if (env.TEAMUP_COMPOSE_READY == 'true') {
                    echo 'Cleanup: removing any containers and networks for this CI Compose project.'
                    def cleanupStatus = bat(returnStatus: true, script: '%TEAMUP_COMPOSE_COMMAND% down --remove-orphans')
                    if (cleanupStatus != 0) {
                        echo "Compose cleanup returned ${cleanupStatus}; no containers are started by the build stage."
                    }
                } else {
                    echo 'Cleanup skipped because a Docker Compose command could not be resolved.'
                }
            }
        }
        success {
            echo 'TeamUp CI succeeded: project validation, Compose validation, and Docker image build passed.'
        }
        failure {
            echo 'TeamUp CI failed. Review the first failed stage in the Jenkins console output.'
        }
    }
}
