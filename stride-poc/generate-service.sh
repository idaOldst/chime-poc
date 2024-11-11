#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "jq is not installed. Please install it to proceed."
  exit 1
fi

# Check if parent folder, service name, and service type are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <parent-folder> <service-name> <service-type>"
  exit 1
fi

PARENT_FOLDER=$1
SERVICE_NAME=$2
SERVICE_TYPE=$3
CAPITALIZED_SERVICE_NAME=$(echo "$SERVICE_NAME" | tr '[:lower:]' '[:upper:]')
LOWERCASE_SERVICE_NAME=$(echo "$SERVICE_NAME" | tr '[:upper:]' '[:lower:]')

# Run the NX CLI command with the provided service name
yarn nx generate @nx/nest:application --name=$SERVICE_NAME --directory=apps/$PARENT_FOLDER/$SERVICE_NAME --e2eTestRunner=none --no-interactive

# # Delete the eslint.config.js file in the created directory
# ESLINT_CONFIG_PATH="apps/$PARENT_FOLDER/$SERVICE_NAME/eslint.config.js"
# if [ -f "$ESLINT_CONFIG_PATH" ]; then
#   rm "$ESLINT_CONFIG_PATH"
#   # echo "Deleted $ESLINT_CONFIG_PATH."
# else
#   echo "eslint.config.js not found at $ESLINT_CONFIG_PATH."
# fi

# Path to the generated webpack.config.js
WEBPACK_CONFIG_PATH="apps/$PARENT_FOLDER/$SERVICE_NAME/webpack.config.js"

# Check if webpack.config.js exists
if [ ! -f "$WEBPACK_CONFIG_PATH" ]; then
  echo "webpack.config.js not found at $WEBPACK_CONFIG_PATH"
  exit 1
fi

# Add libraryTarget: 'commonjs2' to the output node
sed -i "/output: {/a \    libraryTarget: 'commonjs2'," "$WEBPACK_CONFIG_PATH"

echo "Modified $WEBPACK_CONFIG_PATH to include libraryTarget: 'commonjs2' in the output node."

# Path to the project.json file
PROJECT_JSON_PATH="apps/$PARENT_FOLDER/$SERVICE_NAME/project.json"

# Check if project.json exists
if [ ! -f "$PROJECT_JSON_PATH" ]; then
  echo "project.json not found at $PROJECT_JSON_PATH"
  exit 1
fi

# Add build-serverless-files target to the project.json
sed -i '/"targets": {/a \    "build-serverless-files": {\n      "executor": "nx:run-commands",\n      "options": {\n        "cwd": "dist/apps/'"$PARENT_FOLDER/$SERVICE_NAME"'",\n        "commands": [\n          {\n            "command": "yarn add tslib"\n          }\n        ],\n        "parallel": false\n      }\n    },' "$PROJECT_JSON_PATH"

echo "Added build-serverless-files target to $PROJECT_JSON_PATH."

# Path to the package.json file
PACKAGE_JSON_PATH="package.json"

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON_PATH" ]; then
  echo "package.json not found at $PACKAGE_JSON_PATH"
  exit 1
fi

# Add specific lines to the package.json using sed
sed -i '/"scripts": {/a \    "build-'"$SERVICE_NAME"'": "nx build '"$SERVICE_NAME"' --skip-nx-cache --configuration=production",\n    "post-build-'"$SERVICE_NAME"'": "nx build-serverless-files '"$SERVICE_NAME"'",' "$PACKAGE_JSON_PATH"

echo "Added build and post-build scripts to $PACKAGE_JSON_PATH."

# Path to the template main.ts file based on service type
if [ "$SERVICE_TYPE" == "API" ]; then
  TEMPLATE_MAIN_PATH="script-files/api_main.ts"
elif [ "$SERVICE_TYPE" == "SQS" ]; then
  TEMPLATE_MAIN_PATH="script-files/sqs_main.ts"
else
  echo "Invalid service type. Use 'API' or 'SQS'."
  exit 1
fi

# Check if the template main.ts exists
if [ ! -f "$TEMPLATE_MAIN_PATH" ]; then
  echo "Template main.ts not found at $TEMPLATE_MAIN_PATH"
  exit 1
fi

# Path to the generated main.ts file
GENERATED_MAIN_PATH="apps/$PARENT_FOLDER/$SERVICE_NAME/src/main.ts"

# Replace [APP-NAME] with the service name in the template main.ts and copy it to the generated service folder
sed "s/\[APP-NAME\]/$CAPITALIZED_SERVICE_NAME/g" "$TEMPLATE_MAIN_PATH" > "$GENERATED_MAIN_PATH"

echo "Replaced main.ts in the generated service folder with the modified template."

# If the service type is SQS, replace app.service.ts
if [ "$SERVICE_TYPE" == "SQS" ]; then
  TEMPLATE_SERVICE_PATH="script-files/sqs_app.service.ts"
  GENERATED_SERVICE_PATH="apps/$PARENT_FOLDER/$SERVICE_NAME/src/app/app.service.ts"

  # Check if the template app.service.ts exists
  if [ ! -f "$TEMPLATE_SERVICE_PATH" ]; then
    echo "Template app.service.ts not found at $TEMPLATE_SERVICE_PATH"
    exit 1
  fi

  # Replace [APP-NAME] with the service name in the template app.service.ts and copy it to the generated service folder
  sed "s/\[APP-NAME\]/$CAPITALIZED_SERVICE_NAME/g" "$TEMPLATE_SERVICE_PATH" > "$GENERATED_SERVICE_PATH"

  echo "Replaced app.service.ts in the generated service folder with the modified template."

  # Replace app.controller.ts with sqs.controller.ts
  TEMPLATE_CONTROLLER_PATH="script-files/sqs.controller.ts"
  GENERATED_CONTROLLER_PATH="apps/$PARENT_FOLDER/$SERVICE_NAME/src/app/app.controller.ts"

  # Check if the template app.controller.ts exists
  if [ ! -f "$TEMPLATE_CONTROLLER_PATH" ]; then
    echo "Template app.controller.ts not found at $TEMPLATE_CONTROLLER_PATH"
    exit 1
  fi

  # Replace [APP-NAME] with the service name in the template app.controller.ts and copy it to the generated service folder
  sed "s/\[APP-NAME\]/$CAPITALIZED_SERVICE_NAME/g" "$TEMPLATE_CONTROLLER_PATH" > "$GENERATED_CONTROLLER_PATH"

  echo "Replaced app.controller.ts in the generated service folder with the modified template."
fi

# Path to the deployment.json template
DEPLOYMENT_TEMPLATE_PATH="script-files/deployment.json"

# Check if deployment.json exists
if [ ! -f "$DEPLOYMENT_TEMPLATE_PATH" ]; then
  echo "deployment.json template not found at $DEPLOYMENT_TEMPLATE_PATH"
  exit 1
fi

# Path to the deployment.config.json file
DEPLOYMENT_CONFIG_PATH="deployment.config.json"

# Read the template, replace placeholders, and append to deployment.config.json
if [ -f "$DEPLOYMENT_CONFIG_PATH" ]; then
  # Create a new entry from the template
  NEW_ENTRY=$(jq --arg serviceName "$SERVICE_NAME" --arg parentFolder "apps/$PARENT_FOLDER" \
    '. | .service_name = $serviceName | .parent_folder = $parentFolder | .build_scripts = (.build_scripts | map(gsub("\\[APP-NAME\\]"; $serviceName)))' "$DEPLOYMENT_TEMPLATE_PATH")

  # Append the new entry to the data array
  jq --argjson newEntry "$NEW_ENTRY" '.data += [$newEntry]' "$DEPLOYMENT_CONFIG_PATH" > tmp.$$.json && mv tmp.$$.json "$DEPLOYMENT_CONFIG_PATH"
else
  echo "deployment.config.json not found at $DEPLOYMENT_CONFIG_PATH"
  exit 1
fi

echo "Appended new service configuration for $SERVICE_NAME to $DEPLOYMENT_CONFIG_PATH."

# Ensure the target directory exists
TARGET_DIR="terraform/dev2"
mkdir -p "$TARGET_DIR"

# Select the appropriate Terraform template based on the service type
if [ "$SERVICE_TYPE" == "API" ]; then
  TF_TEMPLATE="script-files/default-api.tf"
elif [ "$SERVICE_TYPE" == "SQS" ]; then
  TF_TEMPLATE="script-files/default-sqs.tf"
else
  echo "Invalid service type. Use 'API' or 'SQS'."
  exit 1
fi

# Check if the Terraform template exists
if [ ! -f "$TF_TEMPLATE" ]; then
  echo "Terraform template not found at $TF_TEMPLATE"
  exit 1
fi

# Copy and replace [APP-NAME] in the selected Terraform template file
sed "s/\[APP-NAME\]/$LOWERCASE_SERVICE_NAME/g" "$TF_TEMPLATE" > "$TARGET_DIR/${LOWERCASE_SERVICE_NAME}.tf"

echo "Copied and modified $TF_TEMPLATE to $TARGET_DIR as ${LOWERCASE_SERVICE_NAME}.tf."