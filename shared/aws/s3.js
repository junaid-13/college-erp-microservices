"use strict";

const crypto = require("crypto");

const {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const logger = require("../logger/logger");

// Allowed attachment content types (Task 10.17, extended for Task 13.5).
const ALLOWED_MIME = new Map([
  ["application/pdf", "pdf"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["application/msword", "doc"],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "docx",
  ],
  ["application/zip", "zip"],
  ["application/x-zip-compressed", "zip"],
]);

let client = null;

/**
 * Lazily create and return a singleton S3 client.
 * Reads AWS_REGION and credentials from the environment.
 *
 * @returns {S3Client}
 */
function getS3Client() {
  if (client) return client;

  const region = process.env.AWS_REGION || "ap-south-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  client = new S3Client({
    region,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
  });

  logger.info(`[s3] S3 client initialized (region: ${region})`);
  return client;
}

/**
 * Verify that the configured bucket exists and is reachable.
 *
 * @param {string} [bucket]
 * @returns {Promise<boolean>}
 */
async function verifyBucket(bucket = process.env.AWS_S3_BUCKET) {
  if (!bucket) {
    logger.warn("[s3] AWS_S3_BUCKET not set; skipping bucket verification.");
    return false;
  }

  try {
    await getS3Client().send(
      new HeadBucketCommand({
        Bucket: bucket,
      }),
    );

    logger.info(`[s3] Bucket connection verified: ${bucket}`);
    return true;
  } catch (err) {
    logger.error(
      `[s3] Bucket verification failed for "${bucket}": ${err.message}`,
    );
    return false;
  }
}

/**
 * Upload a file buffer to S3 and return its public/object URL.
 *
 * @param {Object} opts
 * @param {Buffer} opts.buffer
 * @param {string} opts.mimeType
 * @param {string} [opts.keyPrefix]
 * @param {string} [opts.bucket]
 * @returns {Promise<string>}
 */
async function uploadFile({
  buffer,
  mimeType,
  keyPrefix = "uploads/",
  bucket = process.env.AWS_S3_BUCKET,
}) {
  const ext = ALLOWED_MIME.get(mimeType);

  if (!ext) {
    const err = new Error("Unsupported file type. Allowed: PDF, JPG, PNG");
    err.status = 400;
    throw err;
  }

  if (!bucket) {
    const err = new Error("AWS_S3_BUCKET is not configured");
    err.status = 500;
    throw err;
  }

  const safePrefix = String(keyPrefix).replace(/[^a-zA-Z0-9/_-]/g, "");

  const key = [
    safePrefix,
    crypto.randomBytes(16).toString("hex"),
    ".",
    ext,
  ].join("");

  const uploadParams = {
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  };

  await getS3Client().send(new PutObjectCommand(uploadParams));

  const region = process.env.AWS_REGION || "ap-south-1";
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  logger.info(`[s3] Uploaded attachment: ${url}`);

  return url;
}

module.exports = {
  getS3Client,
  verifyBucket,
  uploadFile,
  ALLOWED_MIME,
};
