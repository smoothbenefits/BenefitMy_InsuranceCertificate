Insurance Certificate Service
==========================

System Requirements:

- Need to npm install all packages from package.json
    - If permission issue encountered, try with sudo
- Installation of MongoDB
    - See \config\db.js for assumed DB configurations
- Run the server using with command "npm start"
    - See config\server.js for assumed server configurations
    - If permission issue encountered, try with sudo

Deployment:

- One time setup
    - Prerequsite: Install Elastic Beanstalk CLI
        - http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html 
    - Config the credentials to use with the EB CLI locally
        - Run commang'eb init'
        - When prompted, enter the 'Access ID' and 'Secret Key' for the insurance certificate service EB user
- Routine steps
    - Execute deployment with command "./deploy.sh"
        - If permission issue is encountered, try updating the ACL on the bash script file. "chmod u+x ./deploy.sh"
    - The process could take minutes. So be patient.
    - Once the deployment is done, console should show the successful message
        - "The deployment has been completed!"
    - Go to the AWS console and monitor the status of Elastic Beanstalk
    - Hit /livecheck to make sure the service is live
- Deploy to different environments
    - To Dev
        - Checkout to "development" git branch
        - Make sure to sync with the remote branch
        - Make sure to be clear with any local changes
        - Run the above routine steps to deploy
    - To Staging
        - Once the release-X.Y.Z branch is created for this release, checkout to the branch locally
        - Make sure to sync with the remote branch
        - Make sure to be clear with any local changes
        - Update the 'branch-defaults' section of ./.elasticbeanstalk/config.yml file
            - Set the git branch corresponding to the "insurancecertificate-stg" environment to the new release-X.Y.Z branch
        - Push the changes to ./.elasticbeanstalk/config.yml to remote
        - Run the above routine steps to deploy
    - To Production
        - Once the release-X.Y.Z is tested in staging
            - Merge the branch to master
            - In Github, create a release and tag it with the release number "vX.Y.Z"
        - Checkout to "master" git branch
        - Make sure to sync with the remote branch
        - Make sure to be clear with any local changes
        - Run the above routine steps to deploy to AWS
        - Merge the release-X.Y.Z branch back to development 

Database:

- We chose to use the hosted MongoDB service provided by MongoLab
    - https://mongolab.com/
- Connection URI. See ./config/db.js
    - For deployment on Elastic Beanstalk, the configuration would automatically pull the URI stored in the envrionment variable.
    - For local development, the configuration would use the default one pointing at local running MongoDb server
