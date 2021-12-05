//타입스크립트 -> 자바스크립트의 슈퍼셋 프로그래밍 언어. ts는 js에 ts 문법 추가한 컴파일링언어. 정적 타입 명시 가능. 정적 타이핑 이점을 가짐.
import * as AWS from 'aws-sdk'; //'aws-sdk'로부터 모듈 전체를 import함. AWS라는 이름으로 사용.
AWS.config.update({
    accessKeyId: 'AKIATLDZ3C2MZ4XJQ47X',
    secretAccessKey: '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',
    region:'us-east-1'
}); //액세스 키와 비밀 액세스 키, 리전 값을 넣어서 configuration 업데이트
//sdk 사용을 위해서 credentials 필요하다는 에러때문에 AWS IAM에서 사용자 생성 후 키를 받는다.(필수 작업)
//awsacademy에서 불가능하므로 새로운 계정 생성 후 진행.
import { promises as fs } from 'fs';
//비동기적 파일 시스템 사용을 위해서 'fs'의 promises API를 import함. fs라는 이름으로 사용.

const translate = new AWS.Translate(); //aws-sdk의 Translate()함수를 translate라는 상수로 사용.

const main = async () => { //메인함수 화살표 함수 표현. 비동기 함수의 동기식 처리를 위해 async로.
    try {
       
        const params = {
            SourceLanguageCode: 'en',
            TargetLanguageCode: 'ko',
            Text : "Hello this is sein. I'm producing a program by using aws's translate function."
        } //파라미터. 시작언어코드와 타겟언어코드, 텍스트를 지정해준다.
        //시작 언어코드를 auto로 지정해서 언어인식을 하게 할 수도 있다. Amazon Comprehend의 기능을 이용함.
        
        const translated = await translate.translateText(params).promise();
        //translateText()함수는 지정된 파라미터 값을 받아서 텍스트를 타겟언어로 번역해준다.
        //
        
        console.log(translated.TranslatedText);

    } catch(err){
        console.error(err); //에러 핸들링.
    }
};

main();
