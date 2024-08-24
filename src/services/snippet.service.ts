import Snippet from "../models/Snippet.model";

export async function createSnippetId(
    clerkId: any,
    body: {
        brandName: string;
        brandLogo: string;
        welcome: string;
        buttonMsg: string;
        elementPosition: string;
    }
): Promise<any> {

    const {
        brandName,
        brandLogo,
        welcome,
        buttonMsg,
        elementPosition,
    } = body;
    const snippetId = await generateRandomString()

 const result = await Snippet.findOneAndUpdate({
    clerkId: ""
 }, {
    brandName,
    brandLogo,
    welcome,
    buttonMsg,
    elementPosition,
    status: "Active",
    snippetId,
 }, {
    new: true,
    upsert: true
 })

 return result;
}


export async function generateRandomString(): Promise<any> {
    const randomString = (Math.random().toString(36).slice(2, 7) + Math.random().toString(36).slice(2, 5)).split('').sort(() => Math.random() - 0.5).join('').slice(0, 5) + Math.floor(100 + Math.random() * 900);
    if(randomString){
        const snippetDetail = await Snippet.findOne({snippetId: randomString});
        if(snippetDetail){
          return generateRandomString();
        }else{
            return randomString;
        }
    }
}

