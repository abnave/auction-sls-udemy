import {getAuctionById} from "./getAuction";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";
export async function uploadAuctionPicture(event){
    const {id} = event.pathParameters;
    const auction = await getAuctionById(id);
    const base64 = event.body.replace(/^data:image\/\w+;base64,/,"");
    const buffer = Buffer.from(base64,"base64");
    try {
        const pictureURL = await uploadPictureToS3(auction.id +".jpg", buffer);
        const result = await updateAuctionPictureURL(pictureURL);
        console.log(pictureURL);
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
    
    return {
        statusCode:200,
        body: JSON.stringify({})
    };
}
export const handler = middy(uploadAuctionPicture).use(httpErrorHandler);