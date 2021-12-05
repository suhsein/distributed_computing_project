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

const textract = new AWS.Textract(); //aws-sdk의 Textract()함수를 textract라는 상수로 사용.
const translate = new AWS.Translate(); //aws-sdk의 Translate()함수를 translate라는 상수로 사용.

const main = async () => { //메인함수 화살표 함수 표현. 비동기 함수의 동기식 처리를 위해 async로.
    try {
        //read the image
        const buf = await fs.readFile('internationallovesong.PNG'); //상수 buf에 이미지를 비동기적으로 읽어서 넣음.
        //readFile의 인자로 이미지 경로를 넣어줌. 리턴값은 <Buffer>객체 프로미스이다.
        //Buffer는 원시 이진 데이터를 처리하도록 설계된 인스턴스이다. Blob=Binary large object.

        //send to aws
        const textracted = await textract.detectDocumentText({ Document: {Bytes: buf}}).promise();
        //detectDocumentText()함수는 input Document 내에서 text를 인식한다. Bytes field에 buf(버퍼객체)를 넣어준다.
        //S3 Object를 input Document로 사용할 수 있다.
        //비동기적으로 실행되어서 프로미스값을 리턴하도록 하고, textracted에 담는다.

        //parse the result
        console.log(textracted.Blocks?.filter(i => i.BlockType === 'LINE').map(i => i.Text).join('\n'));
        //콘솔에 textracted 출력.
        //res의 blocks(response값으로 block들의 배열이다)에서 filter 메소드로 특정 값만을 걸러내 새로운 배열생성.
        //새로운 배열의 요소는 BlockType이 'LINE'인 요소들.(추출된 blocks에서 줄단위로 구분되는 요소들이다.)
        //걸러진 배열에서 map 메소드로 각 요소의 Text를 가져옴. 
        // (filter 함수는 각 요소들에서 조건을 만족하는 값만 걸러내 배열 생성. map 함수는 각 요소를 한번씩 불러서 반환값으로 배열 생성.)
        //최종적으로 걸러진 배열 요소들을 join 메소드를 통해 합치는데, 합치는 중간에 줄바꿈 문자를 넣음. LINE 단위로 줄바꿈 됨.

        const text: string = String(textracted.Blocks?.filter(i => i.BlockType === 'LINE').map(i => i.Text).join('\n'));
        //string 타입의 text 변수에 document를 파싱한 값을 저장한다.
        //파싱한 값 undefine | string 타입인데, Text 파라미터는 string 타입이어야 하므로 형변환.  

        const params = {
            SourceLanguageCode: 'en',
            TargetLanguageCode: 'ko',
            Text : text
        } //파라미터. 시작언어코드와 타겟언어코드, 텍스트를 지정해준다.
        //시작 언어코드를 auto로 지정해서 언어인식을 하게 할 수도 있다. Amazon Comprehend의 기능을 이용함.
        
        const translated = await translate.translateText(params).promise();
        //translateText()함수는 지정된 파라미터 값을 받아서 텍스트를 타겟언어로 번역해준다.
        //
        
        console.log(translated.TranslatedText);
        
        const FS = require('fs');
        
        FS.writeFile('resultfile.txt', translated.TranslatedText, (err: any)=> { 
            if(err) throw err;
        }); //writeFile 함수를 통해 결과값을 저장한 파일을 생성한다. err시 err를 throw 하도록 처리.

    } catch(err){
        console.error(err); //에러 핸들링.
    }
};

main();
