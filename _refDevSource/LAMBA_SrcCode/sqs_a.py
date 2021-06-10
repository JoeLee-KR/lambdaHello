import json
import boto3


def lambda_handler(event, context):
    sqs_client = boto3.client(
        service_name='sqs',
        region_name='ap-northeast-2'
    )

    response = sqs_client.send_message(
        QueueUrl='https://sqs.ap-northeast-2.amazonaws.com/1234567890/ab_sqs',
        MessageBody='from sqs_a (lambda) '
    )

    print(json.dumps(response))
    return json.dumps(response)
