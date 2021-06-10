import json
import boto3
import botocore


def lambda_handler(event, context):
    s3 = boto3.resource('s3')
    bucket_list = []

    for bucket in s3.buckets.all():
        bucket_list.append(bucket.name)

    return json.dumps(bucket_list)
