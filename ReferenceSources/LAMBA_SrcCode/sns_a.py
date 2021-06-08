import json
import boto3

def lambda_handler(event, context):
    client = boto3.client(service_name='sns')
    response = client.publish(
        TargetArn = '', #'arn:aws:sns:ap-northeast-2:1234567890:ab_sns',
        Message = 'hello',
        Subject = 'sns_a lambda',
        MessageStructure='text'
    )
    print(response)
    return response
