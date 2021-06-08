import json
import boto3

from botocore.exceptions import ClientError


def lambda_handler(event, context):
    try:
        request = event.get("Records")[0].get("cf").get("request")
        authKey = request.get("headers").get("authorization")[0]["value"]

        if authKey != "helloserverless":
            return {
                "status": 401,
                "statusDescription": "Unauthorized",
            }

    except ClientError as e:
        print(e.response["Error"]["Message"])

        return {
            "status": 500,
            "statusDescription": "Internal server error",
        }

    return request
