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
    try:
        if event is not None:
            json_data = json.dumps(event)
            dict = json.loads(json_data)

            if dict["type"] is None:
                print("event type empty")
            else:

                for d in dict["data"]:
                    yyyymmdd = d["yyyymmdd"]
                    title = d["title"]
                    singer = d["info"].get("singer")
                    country = d["info"].get("country")

                if dict["type"] == "put":
                    song_put_response = put_song(yyyymmdd, title, singer, country)
                    print(song_put_response)
                elif dict["type"] == "update":
                    update_response = update_song(yyyymmdd, title, singer, country)
                    print(update_response)
                elif dict["type"] == "delete":
                    delete_response = delete_underrated_song(yyyymmdd, title)
                    print(delete_response)
                elif dict["type"] == "get":
                    song_get_response = get_song(yyyymmdd, title)
                    print(song_get_response)
                else:
                    print("event type error")
        else:
            print("event empty")

    except ClientError as e:
        print(e.response["Error"])

    return "success"
