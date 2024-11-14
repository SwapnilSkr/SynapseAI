import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import "dotenv/config";

const region = process.env.AWS_REGION || "";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const sesClient = new SESClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const sendEmail = async (emailParams: {
  Destination: {
    ToAddresses: any[];
  };
  Message: {
    Body: {
      Html: {
        Charset: string;
        Data: any;
      };
    };
    Subject: {
      Charset: string;
      Data: string;
    };
  };
  Source: string | undefined;
}) => {
  try {
    const command = new SendEmailCommand(emailParams);
    const response = await sesClient.send(command);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const createS3Bucket = async (bucketName: string) => {
  try {
    const bucketParams = {
      Bucket: bucketName,
    };

    const data = await s3Client.send(new CreateBucketCommand(bucketParams));
    console.log("Bucket Created Successfully", data.Location);
  } catch (err) {
    console.error("Error", err);
  }
};
