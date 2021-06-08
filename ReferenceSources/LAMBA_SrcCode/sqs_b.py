import json

def lambda_handler(event, context):
    print('event',event)
    print('context:',context)
    return print(event)
