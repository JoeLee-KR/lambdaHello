import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):

    # 발신자 이메일 주소 
    SENDER = "test@kimminjun.dev"
    # 수신자 이메일 주소
    RECIPIENT = "serverless.kim@gmail.com"
    # 리전 
    AWS_REGION = "us-west-2"
    # 메일 제목 
    SUBJECT = "테스트 메일 발송"
    # HTML이 제공되지 않는 메일 수신자를 위한 TEXT.
    BODY_TEXT = ("SES를 통한 메일 발송 ")
    # HTML을 이용한 메일 본문 
    BODY_HTML = """<html>
    <head></head>
    <body>
    <h1>SES로 메일을 발송했습니다. </h1>
    <p>안녕하세요? </p>
    </body>
    </html>
                """            
    # 인코딩
    CHARSET = "UTF-8"
    # boto3를 이용한 클라이언트 설정 
    client = boto3.client('ses',region_name=AWS_REGION)

    # 메일 발송 
    try:
        print('try')
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER
        )
    # 오류 발생 확인 
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        
    return {
        'statusCode': 200,
        'body': json.dumps('success')
    }


