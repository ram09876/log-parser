const AWS = require('aws-sdk');


AWS.config.update({ region: 'us-east-1' });

AWS.config.Credentials= new AWS.Credentials("accesskey","secretkey", sessionToken = null);

const s3Client = new AWS.S3({ region: 'us-east-1' });

module.exports = {AWS, s3Client}