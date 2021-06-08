import json
import boto3

def lambda_handler(event, context):
    payload = {}
    payload['hello'] = 'hi'
    lan = boto3.client(service_name='lambda',region_name='ap-northeast-2')
    lan.invoke(FunctionName="lambda_a", InvocationType='Event', Payload=json.dumps(payload))
    print(payload)
    return payload
