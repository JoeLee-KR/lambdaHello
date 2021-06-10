import json
import boto3

from botocore.exceptions import ClientError


def put_song(yyyymmdd, title, singer, country):
    dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-2")

    try:
        response = dynamodb.Table("song").put_item(
            Item={
                "yyyymmdd": yyyymmdd,
                "title": title,
                "info": {
                    "singer": singer,
                    "country": country
                }
            }
        )
    except ClientError as e:
        print(e.response["Error"]["Message"])
    else:
        return response


def update_song(yyyymmdd, title, singer, country):
    dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-2")

    try:
        response = dynamodb.Table("song").update_item(
            Key={"yyyymmdd": yyyymmdd, "title": title},
            UpdateExpression="SET info= :values",
            ExpressionAttributeValues={
                ":values": {"singer": singer, "country": country}
            }
        )
    except ClientError as e:
        print(e.response["Error"]["Message"])
    else:
        return response


def get_song(yyyymmdd, title):
    dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-2")

    try:
        response = dynamodb.Table("song").get_item(Key={"yyyymmdd": yyyymmdd, "title": title})
    except ClientError as e:
        print(e.response["Error"]["Message"])
    else:
        return response


def delete_underrated_song(yyyymmdd, title):
    dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-2")

    try:
        response = dynamodb.Table("song").delete_item(
            Key={"yyyymmdd": yyyymmdd, "title": title}
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            print(e.response["Error"]["Message"])
        else:
            raise
    else:
        return response


def lambda_handler(event, context):
    # song_put_response = put_song(20120715, "gangnam style", "psy", "korea")
    # update_response = update_song(20120715, "gangnam style", "psy", "south korea")
    # song_get_response = get_song(20120715, "gangnam style")
    delete_response = delete_underrated_song(20120715, "gangnam style")

    return delete_response
