const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION
});

const getObjectUri = (params) => `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURI([params.Key])}`;

const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

/**
 * Клиент для AWS S3
 */
class AwsS3Client {
    /**
     * Получить объект
     * @param {*} params 
     */
    async getObject(params) {
        const getObjectCommand = new GetObjectCommand(params);
        const data = await s3Client.send(getObjectCommand);
        return streamToString(data.Body);
    }

    /**
     * Добавить объект
     * @param {} params 
     */
    async putObject(params) {
        const putObjectCommand = new PutObjectCommand(params);
        await s3Client.send(putObjectCommand);
        return {
            status: 'ok',
            objectUri: getObjectUri(params)
        }
    }

    /**
     * Удалить объект
     * @param {} params 
     */
    async deleteObject(params) {
        const deleteObjectCommand = new DeleteObjectCommand(params);
        const data = await s3Client.send(deleteObjectCommand);
        return {
            status: 'ok',
            objectName: params.Key
        }
    }
}

module.exports = new AwsS3Client();