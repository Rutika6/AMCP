# TeamUp CP Jenkins CI

## Jenkins Continuous Integration

Jenkins is an automation server that runs repeatable jobs when code changes. This project uses Jenkins for Continuous Integration (CI): Jenkins checks out the Git repository and verifies that the checked-in TeamUp project can still be validated and built. The pipeline is defined as code in [`Jenkinsfile`](Jenkinsfile), beside the existing Compose file. It uses the existing Dockerfiles and `docker-compose.yml`; it does not start the application or replace its Docker setup.

### What the pipeline does

1. **Checkout** gets the commit configured for the Jenkins job.
2. **Validate Project** checks that the Compose file, frontend and backend Dockerfiles, and package manifests are present in the expected locations.
3. **Validate Docker Compose** runs `docker compose config --quiet` to check the Compose configuration.
4. **Build Docker Images** runs `docker compose build` using the repository's existing Compose file and Dockerfiles.
5. **Cleanup** runs after success, failure, or abort. It removes any containers and networks associated with this build's unique Compose project name. The pipeline only builds images; it does not run the application services.

There are no automated test scripts in the frontend or backend package manifests, so the pipeline does not claim to run application tests. The Docker image build is the main CI verification. A failed required stage fails the Jenkins build. The cleanup result is reported separately and does not hide the original build result.

### Install and start Jenkins on Windows

1. Install a supported **Java 21 or later** runtime and Docker Desktop. Start Docker Desktop and wait until its engine is running.
2. In the same Windows account that will run Jenkins, open PowerShell and confirm `java -version` and `docker compose version` work. Jenkins needs the Docker CLI on its `PATH` and access to the Docker Desktop engine. Running the Jenkins WAR interactively under this account is a straightforward local practical setup; a Jenkins Windows service must instead be configured with an account and environment that can access Docker Desktop.
3. Download the Jenkins **LTS WAR** from the [official Jenkins download page](https://www.jenkins.io/download/). In PowerShell, change to the directory containing the downloaded file and start it:

   ```powershell
   java -jar .\jenkins.war --httpPort=8081
   ```

   Keep this terminal open while using Jenkins. Port 8081 avoids the TeamUp backend's port 8080. Open [http://localhost:8081](http://localhost:8081) in a browser.
4. Unlock Jenkins using the initial password shown in the terminal or in `%USERPROFILE%\.jenkins\secrets\initialAdminPassword`. Complete the setup wizard and install the suggested plugins, including **Pipeline** and **Git**.
5. Ensure the Windows account running Jenkins can use Docker Desktop. For an MSI-installed Jenkins service, configure the service to run as a Windows account with Docker Desktop access, then restart the service after Docker Desktop is running. If the Jenkins service cannot see Docker's named pipe or CLI, use the interactive WAR method above for the local demonstration.

Jenkins' official [Windows installation guide](https://www.jenkins.io/doc/book/installing/windows/) describes the MSI service setup. Java version requirements may change, so check that guide when setting up a different Jenkins release.

### Create and run the Pipeline job

1. In Jenkins, choose **New Item**, enter a name such as `TeamUp-CI`, select **Pipeline**, and click **OK**.
2. In the job configuration's **Pipeline** section, set **Definition** to **Pipeline script from SCM** and **SCM** to **Git**.
3. Set **Repository URL** to `https://github.com/Rutika6/AMCP` and **Branch Specifier** to `*/main`. Set **Script Path** to `Jenkinsfile` and save. If the repository becomes private, create a Jenkins credential under **Manage Jenkins → Credentials** and select it in the job; do not place a password or token in the Jenkinsfile or repository.
4. Confirm Docker Desktop is running, then open the job and click **Build Now**. Open the build and select **Console Output** to follow its stages.
5. For automatic builds on pushes, configure a GitHub webhook to the Jenkins endpoint or enable SCM polling in the job. The Jenkins host must be reachable by the webhook sender; for a local-only practical, **Build Now** is sufficient.

A successful run shows the Checkout, Validate Project, Validate Docker Compose, and Build Docker Images stages completed, followed by cleanup and a final **SUCCESS** result. The console includes Docker's image build output. Jenkins itself must be running on a Windows machine with a working Docker CLI/engine; this pipeline has been prepared for Jenkins, but it has not been run by Jenkins as part of this change.

### Troubleshooting

- **`docker` is not recognized:** Install Docker Desktop, add its CLI location to the Windows `PATH`, restart Jenkins after updating the environment, and verify `docker compose version` from the same Windows account Jenkins uses.
- **Cannot connect to the Docker daemon / named pipe:** Start Docker Desktop and wait for its engine. Ensure Jenkins runs under the Windows account that has Docker Desktop access. A service may not inherit an interactive user's environment or access to the per-user Docker engine.
- **Compose reports missing variables or invalid configuration:** Check `docker compose config` locally from the repository root and confirm no required variable was added without a safe default. Keep credentials out of tracked files; use Jenkins Credentials Manager if a future job needs them.
- **Git checkout fails:** Verify the repository URL, branch specifier, and Git plugin. For a private repository, add a Jenkins credential and select it in the job.
- **Image build fails:** Read the first Docker build error in Console Output. Confirm Docker Desktop has enough disk space and that the existing frontend/backend dependency lockfiles are present in the checkout.
- **The job cannot find project files:** Ensure **Script Path** is `Jenkinsfile`, the job checks out the repository root, and the branch contains the root-level Jenkinsfile.
