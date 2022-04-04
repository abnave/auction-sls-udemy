import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
export async function closeAuction(auction){
   const params = {
       TableName: process.env.AUCTIONS_TABLE_NAME,
       Key: { id:auction.id},
       UpdateExpression: 'set #status = :status',
       ExpressionAttributeValues: {
           ':status': 'CLOSED'
       },
       ExpressionAttributeNames: {
        '#status' : 'status'
    }
   };
   await dynamoDB.update(params).promise();
   const {title, seller, highestBid} = auction;
   const {amount, bidder} = highestBid;
   if(amount === 0){
    await sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: "Your Item has not been sold",
            recipient: seller,
            body: `Please try to set auction again for "${title}" `
        }),
    }).promise();
    return;
   }
   const notifySeller = sqs.sendMessage({
       QueueUrl: process.env.MAIL_QUEUE_URL,
       MessageBody: JSON.stringify({
           subject: "Your Item has been sold",
           recipient: seller,
           body: `Wooho! Your item "${title}" has been sold for ${amount}`
       }),
   }).promise();
   const notifyBidder = sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE_URL,
    MessageBody: JSON.stringify({
        subject: "You wan an auction!",
        recipient: bidder,
        body: `What a great Deal! You got yourself a "${title}" for only ${amount} Rs.`
    }),
   }).promise();

   return Promise.all([notifyBidder,notifySeller]);
}