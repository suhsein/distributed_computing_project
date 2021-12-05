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

const main = async () => { //메인함수 화살표 함수 표현. 비동기 함수의 동기식 처리를 위해 async로.
    try {
        //read the image
        const buf = await fs.readFile('receipt.png'); //상수 buf에 이미지를 비동기적으로 읽어서 넣음.
        //readFile의 인자로 이미지 경로를 넣어줌. 리턴값은 <Buffer>객체 프로미스이다.
        //Buffer는 원시 이진 데이터를 처리하도록 설계된 인스턴스이다. Blob=Binary large object.

        //send to aws
        const res = await textract.detectDocumentText({ Document: {Bytes: buf}}).promise();
        //detectDocumentText()함수는 input Document 내에서 text를 인식한다. Bytes field에 buf(버퍼객체)를 넣어준다.
        //S3 Object를 input Document로 사용할 수 있다.
        //비동기적으로 실행되어서 프로미스값을 리턴하도록 하고, res에 담는다.

        //parse the result
        console.log(res);
        //콘솔에 res를 출력.

    } catch(err){
        console.error(err); //에러 핸들링.
    }
};

main();
