/*
 * Step 3. (3-1) 트랜스코더에게 작업 생성의뢰..
 * 사용할 트랜스코더의 파이프라인 ID를 알고 있어야 함
 */

'use strict';
var AWS = require('aws-sdk');

// 사용(호출할) 서비스 자원을 준비하고, 해당 자원이 동작할 해당 region 선택을 확인한다.
var elasticTranscoder = new AWS.ElasticTranscoder({
    region: 'ap-northeast-1'
});

// 이 Lambda Function의 handler:
// event : Front에서 이 Function을 호출할때 넘어오는 Event Object 정보
//         event로 넘어온 정보의 consistency확인도 function내부에서 해야되는 것은 당연하다. 
//         Caller쪽에서 해도 되기는 하지만... 
//         실제 개발이라면, 이 부분도 modulize filter가 필요해 보이기도 한다.
// context :
// callback : 문제 발생시 되돌려져야하는 Front의 Reference 정보
// params : Back으로 넘겨줄 정보의 Object이다.
//          해당 Function이 Transcode Video 서비스로 던져질 것이므로, 여기에 맞는 Object를 구성한다.
//          PupelineId, Input, Output 정보들이 필요한 구조인 것이다.
exports.handler = function(event, context, callback){
    console.log('Welcome, this is 01_TransVideo01.');

    // event에서 받아 오는 s3의 key는 저장된 파일이름으로 URL인코딩 되어있다. 사용하려면 URL디코딩 되어야 한다.
    //the input file may have spaces so replace them with '+'
    var key = event.Records[0].s3.object.key;
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

    //remove the extension
    var outputKey = sourceKey.split('.')[0];

    var params = {
        // PipelineId는 우리가 사용하기 위해 만들어놓은 것의 Id를 사용한다.
        // 아래 것은 ap-northeast-1에 하나 만들어 놓은 것이다.
        PipelineId: '1623120391203-6rqbho',
        Input: {
            Key: sourceKey
        },
        Outputs: [
            // 720p, 16:9 480p 만 테스트용으로 해 본다.
            /*
            {
                Key: outputKey + '-1080p' + '.mp4',
                PresetId: '1351620000001-000001' //Generic 1080p
            },
            */
            {
                Key: outputKey + '-720p' + '.mp4',
                PresetId: '1351620000001-000010' //Generic 720p
            },
            {
                Key: outputKey + '-480p169' + '.mp4',
                PresetId: '1351620000001-000020' //Generic 480p 16:9
            }
            /*
            {
                Key: outputKey + '-web-720p' + '.mp4',
                PresetId: '1351620000001-100070' //Web Friendly 720p
            }
            */
        ]};

    // 단순 log
    console.log('01_TransVideo01 : ');
    console.log('key :' + key);
    console.log('sourceKey :' + sourceKey);
    console.log('outputKey :' + outputKey);
    console.log('params.PipelineId :' + params.PipelineId);
    console.log('params.Outputs :' + params.Outputs[0]);

    // elasticTranscoder Object에 params로 내용을 지정하고, 
    // Job creation Method를 수행한다.
    elasticTranscoder.createJob(params, function(error, data){
        if (error){
            callback(error);
        }
    });
    console.log('01_TransVideo01 : after elasticTranscoder.createJob()');
};
