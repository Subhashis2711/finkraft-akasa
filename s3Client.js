import aws from 'aws-sdk';
import fs from 'fs';



const access_key = "AKIAWVKQBF2LU7KM3REO";
const secret_key = "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"

const bucket = "akasa-test";


const s3 = new aws.S3({
    accessKeyId: access_key,
    secretAccessKey: secret_key
});

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName);

    const params = {
        Bucket: 'akasa-test',
        Key: `uniqueid-subh-27/${fileName}`,
        Body: fileContent
    };

    s3.upload(params, (err, data) => {
        if(err){
            console.error(err)
        }
        console.log(`File(${fileName}) has been uploaded successfully at: ${data.location}`);
    })
}

export { uploadFile }