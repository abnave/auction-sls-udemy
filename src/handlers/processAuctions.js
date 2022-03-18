import { getEndedAuctions } from "../lib/getEndedAuctions";
const processAuctions = async (event,context) => {
    const auctionsToClose = await getEndedAuctions();
    console.log(auctionsToClose);
console.log("Processing Auction");
};
export const handler = processAuctions;