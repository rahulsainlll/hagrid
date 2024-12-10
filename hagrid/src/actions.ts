import { dryrun, message, createDataItemSigner } from "@permaweb/aoconnect";

declare global {
  interface Window {
    arweaveWallet: any;
  }
}

export async function performQueryDryrun(query: string) {
  try {
    const result = await dryrun({
      process: "ls75Hu0XXVO4iA5gL4mOFZIa9GiyRaphE-5bsO5rT1k",
      tags: [
        { name: "Action", value: "Query" }
      ],
      data: query 
    });

    if (result.Messages && result.Messages.length > 0) {
      const firstMessage = result.Messages[0];
      
      if (firstMessage.Data) {
        try {
          const parsedData = JSON.parse(firstMessage.Data);
          return parsedData;
        } catch (parseError) {
          console.error("Error parsing query result:", parseError);
          return firstMessage.Data; 
        }
      } else {
        console.error("No data found in the query result");
        return null;
      }
    } else {
      console.error("No messages returned from dryrun");
      return null;
    }
  } catch (error) {
    console.error("Error performing query dryrun:", error);
    return null;
  }
}

export async function performIndexMe(data: string) {
  try {
    console.log("first")
    const result = await message({
      process: "ls75Hu0XXVO4iA5gL4mOFZIa9GiyRaphE-5bsO5rT1k",
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [
        { name: "Action", value: "Index" }
      ],
      data:data,
    });

    console.log(result) 
    
      
  } catch (error) {
    console.error("Error performing message:", error);
    return null;
  }
}