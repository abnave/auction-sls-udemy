import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
export async function getAuctionById(id){
  let auction;
  try {
      const result = await dynamoDB.get({
          TableName:process.env.AUCTIONS_TABLE_NAME,
          Key: {id}
    }).promise();
      auction = result.Item;
  } catch (error) {
      console.log(error);
      throw new createError.InternalServerError(error);
  }
  return auction;
}
async function getAuction(event, context) {
  const {id} = event.pathParameters;
  let auction;
  auction = await getAuctionById(id);
  if(!auction){
      throw new createError.NotFound(`Auction with id ${id} not found!`);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);


