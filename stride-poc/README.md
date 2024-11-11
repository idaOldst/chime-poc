## Generate a New App with NX CLI

To create a new NEST application using the NX CLI, run the following command in your terminal:


./generate-service.sh [parent-folder] [app-name] [trigger-type] 
e.g. ./generate-service.sh misc test-service API 
e.g. ./generate-service.sh authentication authentication-event-log-service SQS 




IMPORTANT: 
- Add the necessary packages / library on project.json if nx workspace didn't include them during the build process



Sample SQS Message to be Received : 
NOTE : body.data -> actual data sent to SNS FIFO 
[
  {
    "body": "{\n  \"Message\": \"{\\\"logId\\\": null,\\\"action\\\": \\\"CREATE\\\", \\\"sessionId\\\": \\\"sessionId\\\", \\\"entity\\\": \\\"USER\\\",\\\"referenceId\\\": \\\"01J8KRNJZQHE5AZT96H55MMKHW\\\", \\\"data\\\": {\\\"email\\\": \\\"string\\\", \\\"sessionId\\\": \\\"sessionId\\\",\\\"userRole\\\": \\\"USER\\\", \\\"firstName\\\": \\\"string\\\", \\\"lastName\\\": \\\"string\\\", \\\"data\\\": {\\\"country\\\": \\\"string\\\"}}}\"\n}"
  }
]


Sample Data for Custom Cognito Message : 
{
    "version": "1",
    "region": "eu-west-2",
    "userPoolId": "eu-west-2_itQT3MKZj",
    "userName": "26e2d294-80b1-709e-51e1-27beb70d3cee",
    "callerContext": {
        "awsSdkVersion": "aws-sdk-js-2.1639.0",
        "clientId": "CLIENT_ID_NOT_APPLICABLE"
    },
    "triggerSource": "CustomMessage_AdminCreateUser",
    "request": {
        "userAttributes": {
            "sub": "26e2d294-80b1-709e-51e1-27beb70d3cee",
            "email_verified": "true",
            "cognito:user_status": "FORCE_CHANGE_PASSWORD",
            "email": "dennis@old.st"
        },
        "codeParameter": "{####}",
        "linkParameter": "{##Click Here##}",
        "usernameParameter": "{username}"
    },
    "response": {
        "smsMessage": null,
        "emailMessage": null,
        "emailSubject": null
    }
}

TERRAFORM NOTES:
- manually create a secret manager record named "terraform_config" with a variable called github_token and add the github_token needed , this is needed for the buildpspec.yml commands
- run the terraform code once on local machine to install the necessay codebuild pipeline needed
- make sure to add the aws_profile on the main.tf (AWS Credentials needed)
- remove the aws_profile variable once the initial local run is successful 
- 