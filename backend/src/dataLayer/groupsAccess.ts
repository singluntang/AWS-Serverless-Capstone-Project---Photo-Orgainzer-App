const AWSXrayConect = require('aws-xray-sdk');
const AWSConect = require('aws-sdk');
const S3Conect = require('aws-sdk');
const AWS = require('aws-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Feed } from '../models/Feed'
import { createLogger } from '../utils/logger'
import Jimp from 'jimp';
const logger = createLogger('groupAcess')



export class GroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3Client: any = createS3Client(),        
    private readonly groupsTable = process.env.GROUPS_TABLE, 
    private readonly feedsTable = process.env.FEEDS_TABLE,
    private bucketName = process.env.IMAGES_S3_BUCKET,
    private thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET,
    private readonly urlExpiration: number = parseInt(process.env.SIGNED_URL_EXPIRATION))    
        
    {
    }


    // async createTables(): Promise<Boolean> {
    //       // This CreateTable request will create the Groups table.
    //       // With DynamoDB Local, tables are created right away. If you are calling
    //       // a real DynamoDB endpoint, you will need to wait for the table to become
    //       // ACTIVE before you can use it. See also dynamodb.waitFor().
    //       var params = {
    //         TableName: this.groupsTable,
    //         KeySchema: [
    //             {
    //                 AttributeName: 'id',
    //                 KeyType: 'HASH'
    //             }
    //         ],
    //         AttributeDefinitions: [
    //             {
    //                 AttributeName: 'id',
    //                 AttributeType: 'S'
    //             }
    //         ],
    //         ProvisionedThroughput:  {
    //             ReadCapacityUnits: 1,
    //             WriteCapacityUnits: 1
    //         }
    //       };
          
    //       logger.info("Create Table", {Msg: 'Creating the Groups table'} )
    //       // Create the DynamoDB service object
    //       let ddb = new AWSConect.DynamoDB({
    //                                   apiVersion: '2012-08-10',
    //                                   region: 'localhost',
    //                                   endpoint: process.env.DYNAMODB_ENDPOINT
    //                                   });
    //       // Call DynamoDB to create the table
    //       await ddb.createTable(params, function(err, data) {
    //         if (err) {
    //           logger.info("Error", {err} )
    //         } else {
    //           logger.info("Groups Table Created", {data} )
    //         }
    //       });

    //       const GlobalSecondaryIndexes: string = "GlobalSecondaryIndexes"


    //       params = {
    //         TableName: this.feedsTable,
    //         KeySchema: [
    //             {
    //                 AttributeName: 'imageId',
    //                 KeyType: 'HASH'
    //             }
    //         ],
    //         AttributeDefinitions: [
    //             {
    //                 AttributeName: 'imageId',
    //                 AttributeType: 'S'
    //             }
    //         ],
    //         [GlobalSecondaryIndexes]: [
    //                 {
    //                     IndexName: "ImageIdIndex",
    //                     Projection: {
    //                         ProjectionType: "ALL"
    //                     },
    //                     ProvisionedThroughput: {
    //                         WriteCapacityUnits: 5,
    //                         ReadCapacityUnits: 10
    //                     },
    //                     KeySchema: [
    //                         {
    //                             KeyType: "HASH",
    //                             AttributeName: "imageId"
    //                         }
    //                     ]
    //                 }
    //         ],
    //         ProvisionedThroughput:  {
    //             ReadCapacityUnits: 1,
    //             WriteCapacityUnits: 1
    //         }
    //     };
    //     logger.info("Create Table", {Msg: 'Creating the Feeds table'} )
    //     // Call DynamoDB to create the table
    //      await ddb.createTable(params, function(err, data) {
    //       if (err) {
    //         logger.info("Error", {err} )
    //       } else {
    //         logger.info("Feeds Table Created", {data} )
    //       }
    //     });

    //       return true;
    //   }


    //   async deleteTables(): Promise<Boolean> {
    //     // This CreateTable request will create the Groups table.
    //     // With DynamoDB Local, tables are created right away. If you are calling
    //     // a real DynamoDB endpoint, you will need to wait for the table to become
    //     // ACTIVE before you can use it. See also dynamodb.waitFor().
    //     var params = {
    //       TableName: this.groupsTable
    //     };
        
    //     logger.info("Delete Table", {Msg: 'deleting the Groups table'} )
    //     // Create the DynamoDB service object
    //       let ddb = new AWSConect.DynamoDB({
    //                                   apiVersion: '2012-08-10',
    //                                   region: 'localhost',
    //                                   endpoint: process.env.DYNAMODB_ENDPOINT
    //                                   });
    //     // Call DynamoDB to delete the table
    //     await ddb.deleteTable(params, function(err, data) {
    //       if (err && err.code === 'ResourceNotFoundException') {
    //         logger.info("Delete Table", {Msg: 'Table not found'} )
    //         return true
    //       } else if (err && err.code === 'ResourceInUseException') {
    //         logger.info("Delete Table", {Msg: 'Table in use'} )
    //         return false
    //       } else {
    //         logger.info("Delete Table", {Msg: 'Delete Success'} )
    //         return true
    //       }
    //     });

    //     var params = {
    //       TableName: this.feedsTable
    //     };
        
    //     logger.info("Delete Table", {Msg: 'deleting the Feeds table'} )
    //     // Create the DynamoDB service object
    //     ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    //     // Call DynamoDB to delete the table
    //    await ddb.deleteTable(params, function(err, data) {
    //       if (err && err.code === 'ResourceNotFoundException') {
    //         logger.info("Delete Table", {Msg: 'Table not found'} )
    //         return true
    //       } else if (err && err.code === 'ResourceInUseException') {
    //         logger.info("Delete Table", {Msg: 'Table in use'} )
    //         return false
    //       } else {
    //         logger.info("Delete Table", {Msg: 'Delete Success'} )
    //         return true
    //       }
    //     });

    //     return true;
    // }

    async createGroup(): Promise<boolean> {

              // if (process.env.IS_OFFLINE.toLowerCase() == "true") 
              //     await this.createTables()

              let error: boolean = false;

              const tableName = this.groupsTable
          
          
              logger.info("tableName", {tableName} )
          
            
              const deleteItems =   [
                {
                  DeleteRequest: {
                    Key: { id: '1' }
                  }
                },            
                {
                  DeleteRequest: {
                    Key: { id: '2' }
                  }
                },                        
                {
                  DeleteRequest: {
                    Key: { id: '3' }
                  }
                },            
                {
                  DeleteRequest: {
                    Key: { id: '4' }
                  }
                } 
                ,            
                {
                  DeleteRequest: {
                    Key: { id: '5' }
                  }
                } 
                ,            
                {
                  DeleteRequest: {
                    Key: { id: '6' }
                  }
                } 
                ,            
                {
                  DeleteRequest: {
                    Key: { id: '7' }
                  }
                } 
                ,            
                {
                  DeleteRequest: {
                    Key: { id: '8' }
                  }
                }                                                         
              ]   
            
            
            
            
              const jsonDelete =  {
                    RequestItems: {
                      [tableName]: [...deleteItems]
                    }
                  }
            
                await this.docClient.batchWrite(JSON.parse(JSON.stringify(jsonDelete))).promise()
                  .then(() => {
                    logger.info('Items deleted', {delete: 'deleted'})
                  })
                  .catch((e) => {
                    logger.info('Failed to delete', {delete: e.message}) 
                    error = true
                  })
            
                  if (error) return true
            
            
                const addItems = [            
                  {              
                    PutRequest: {
                      Item: {
                        "id": "1",
                        "name": "Pets",
                        "description": "Dogs and Cats"
                      }
                    }
                  },          
                  {
                    PutRequest: {
                      Item: {
                        "id": "2",
                        "name": "Vacation",
                        "description": "All my Vacation Pics"
                      }
                    }
                  },          
                  {
                    PutRequest: {
                      Item: {
                        "id": "3",
                        "name": "Friends",
                        "description": "All my Friends Pics"
                      }
                    }
                  },          
                  {
                    PutRequest: {
                      Item: {
                        "id": "4",
                        "name": "Family",
                        "description": "All my Family Pics"
                      }
                    }
                  },
                  ,          
                  {
                    PutRequest: {
                      Item: {
                        "id": "5",
                        "name": "Stars / Adols",
                        "description": "Singer and Movie Stars"
                      }
                    }
                  }  
                  ,          
                  {
                    PutRequest: {
                      Item: {
                        "id": "6",
                        "name": "un grouped",
                        "description": "Un-defined Pics"
                      }
                    }
                  } 
                  ,          
                  {
                    PutRequest: {
                      Item: {
                        "id": "7",
                        "name": "Cars",
                        "description": "All type of Cars"
                      }
                    }
                  }
                  ,          
                  {
                    PutRequest: {
                      Item: {
                        "id": "8",
                        "name": "Sports",
                        "description": "All pics related to Sports"
                      }
                    }
                  }                                               
                ]  
            
            
                const jsonInsert =  {
                    RequestItems: {
                      [tableName]: [...addItems]
                    }
                  }   
            
                  await this.docClient.batchWrite(jsonInsert).promise()
                  .then(() => {
                    logger.info('Items added', {added: 'item added'})
                  })
                  .catch((e) => {
                    logger.info('Failed to add', {added: e.message}) 
                    error = true
                  })
            
                  return error
          
    }

  async getAllGroups(): Promise<any> {
    const result = await this.docClient.scan({
      TableName: this.groupsTable
    }).promise()

    const items = result.Items

    logger.info('Getting groups', {items}) 

    return items 
  }

  async createFeed(feed: Feed): Promise<Feed> {
    await this.docClient.put({
      TableName: this.feedsTable,
      Item: feed
    }).promise()

    return feed as Feed
  }

  async getGroupFeeds(groupId: string): Promise<Feed[]> {
    const params = {
      TableName: this.feedsTable,
      ProjectionExpression: "groupId, imageId, #ts, title, description, imageUrl",
      FilterExpression: "groupId = :groupId",
      ExpressionAttributeNames:{
        "#ts": "timestamp"
      },    
      ExpressionAttributeValues: {
          ":groupId": groupId
      }
    }
  
    const result = await this.docClient.scan(params).promise();
  
    const items = result.Items
    return items as Feed[]
  }

  async getUploadUrl(imageId: string): Promise<string> {

    var params = {Bucket: this.bucketName, Key: imageId, Expires: this.urlExpiration};

    logger.info('UrlUpload Param', params)
    
    return await Promise.resolve(this.s3Client.getSignedUrl('putObject', params))
 
  }

  async deleteFeed(imageId: string) {

    const params = {
      TableName: this.feedsTable,
      Key:{
          "imageId": imageId
      },
      ConditionExpression:"imageId = :imageId",   
      ExpressionAttributeValues:{
          ":imageId":imageId
      },
    };

    await this.docClient.delete(params).promise();

    await this.s3Client
      .deleteObject({
        Bucket: this.bucketName,
        Key: imageId,
      })
      .promise()    

    await this.s3Client
      .deleteObject({
        Bucket: this.thumbnailBucketName,
        Key: `${imageId}.jpeg`,
      })
      .promise()    
 
  }
  
  async attachUrlToFeed(uploadUrl: string, imageId: string) {

    const params = {
      TableName: this.feedsTable,
      Key:{
          "imageId": imageId
      },
      ConditionExpression:"imageId = :imageId",
      UpdateExpression: "set imageUrl = :r",     
      ExpressionAttributeValues:{
          ":imageId":imageId,
          ":r":uploadUrl
      },
    };

    await this.docClient.update(params).promise();
 
  }

  async uploadFile(imageId: string, imageBase64: any): Promise<void> {

    logger.info('Storing S3 item in Base64 Buffer: ', {imageBase64})
    logger.info('Storing S3 name: ', {bucketName: this.bucketName})

    await this.s3Client.putObject({
      Bucket: this.bucketName,
      Key: imageId,
      Body: imageBase64,
    }, () => {});
  }

  async processFeedImage(key: string) {

    
    logger.info('Processing S3 item with key: ', {key})

    try { 

     
        const get_param = {
            Bucket: this.bucketName,
            Key: key,
        };      

        const response = await  this.s3Client.getObject(get_param).promise()
          
          
        //logger.info('Encoded Image',{"data": response.Body})
      
        let body = response.Body

        const image = await Jimp.read(body)

        const resizedImg = await Promise.resolve(image.resize(550, Jimp.AUTO))
      
        //logger.info('Resized Image',{resizedImg})

        const convertedBuffer = await resizedImg.getBufferAsync(Jimp.MIME_JPEG)

        await this.s3Client
          .putObject({
            Bucket: this.thumbnailBucketName,
            Key: `${key}.jpeg`,
            Body: convertedBuffer
          })
          .promise()

          logger.info('Writing image back to S3 bucket', {success: true})       
    }
    catch(error) {
      logger.info('Error in  Processing Image', {error})
      throw new Error(`Error in  Processing Image: ${error}`);
    }

  }

}

function createDynamoDBClient() {
  let XAWS
  if (process.env.IS_OFFLINE.toLowerCase() === "true") {
    logger.info('Creating a local DynamoDB instance', {offline: true})
    return new AWSConect.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: process.env.DYNAMODB_ENDPOINT
    })
  } 
  
  XAWS = AWSXrayConect.captureAWS(AWS);
  
  
  return new XAWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
}

function createS3Client() {
  let S3: any
  if (process.env.IS_OFFLINE.toLowerCase() === "true") {
    logger.info('Creating a local S3 instance', {})
    const S3 = new S3Conect.S3({
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint(process.env.S3_BUCKET_ENDPOINT),
    });
    return S3;
  }

  S3 = new AWS.S3({    
    region: process.env.BUCKET_REGION,
    params: {Bucket: process.env.IMAGES_S3_BUCKET}
  }); 

  return AWSXrayConect.captureAWSClient(S3);
}