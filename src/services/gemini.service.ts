import "dotenv/config";
import axios from 'axios';
import RefundPolicyQuestion from '../models/RefundPolicyQuestions.model';
import ProductsModel from '../models/Products.model';
import { getProducts } from "./shopifyIntegration.service";
import Snippet from "../models/Snippet.model";

export async function refundPolicyText(
    clerkAuth: any,
    body: {
        refundText?: string
        termsText?: string
    }
): Promise<any> {
    const { refundText, termsText } = body;

    let refundQuestions = [
        {} as {
            question: string,
            answer: string,
            keywords: string[]
        }
    ];

    let termsQuestion = [
        {} as {
            question: string,
            answer: string,
            keywords: string[]
        }
    ];

    try {
        // Updated API call configuration
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const dataBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `the text of refund policy is "${refundText}" can you make 10 questions, related answer and keywords with it in json format? for example: { question: "Did Refund Policy is same for all Products?", answer: "Yes, Refund Policy is same for all products, there will be charge of rs. 60 for request", keywords: ["Refund", "All Products", "same for all Products"] }`
                        }
                    ]
                }
            ]
        };

        const configs = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const result = await axios.post(url, dataBody, configs);
        const text = result.data.candidates[0].content.parts[0].text;
        // refundQuestions = result.data.candidates[0].content.parts[0].text;

        try {
            const jsonText = text.replace(/json|/g, '').trim();
            const jsonStartIndex = jsonText.indexOf('[');
            const jsonEndIndex = jsonText.lastIndexOf(']') + 1;
            const jsonString = jsonText.slice(jsonStartIndex, jsonEndIndex);

            const parsedData = JSON.parse(jsonString);
            refundQuestions = parsedData
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }

    } catch (e) {
        console.error("Error while fetching refund questions:", e);
    }

    try {
        const result = await RefundPolicyQuestion.findOneAndUpdate({
            clerkId: clerkAuth.userId,
        }, {
            $set: {
                clerkId: clerkAuth.userId,
                refundText,
                termsText,
                refundQuestions,
                termsQuestion,
            }
        }, {
            upsert: true,
            new: true
        })

        return result;

    } catch (e) {
        console.error("Error while updating the database:", e);
    }
}

export async function addProductInfo(
    clerkAuth: any,
): Promise<any> {
    let response = [];
    const produsts: Array<
        {
            productId?: string,
            productTitle?: string,
            productDescription?: string,
            productCreated?: string,
            status?: string,
            productHandle?: string,
            price?: string,
            imageSrc?: string,
        }
    > = await getProducts(clerkAuth);

    for (const product of produsts) {
        if (product.productTitle) {
            try {

                try {
                    const productExist = await ProductsModel.findOne({
                        productId: product.productId,
                        clerkId: clerkAuth.userId,
                    })
                    if (productExist) {
                        continue;
                    }
                } catch (e) {
                    console.error("e", e)
                }

                // Updated API call configuration
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

                const dataBody = {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
                                    Provide JSON Response such that there are 100 keywords (words only, no space) in array. product name is ${product?.productTitle as string} and product desription is "${product?.productDescription as string} ". suggest keywords considering India.

                                    Please consider various topic such as Price Sensitivity, brand name, Mood (Happy, stressed, tired, refreshed),Social Setting(Alone, with friends, with family),Activity(Workout, yoga, hiking, studying), Weather(Hot, cold, rainy), Season (Summer, spring, fall, winter), Occasion ()Party, picnic, brunch, relaxation), Time of Day (Morning, afternoon, evening),Lifestyle, Values, Attitudes ( Open-minded, skeptical, health-conscious), List of Interests for which people would buy (Fitness, wellness, food, travel, etc.), Occupation( Student, professional, homemaker ), Location, Gender, Age (Young adults, adults, seniors), Flavor Profile (Sweet, tart, fruity, refreshing, tangy,) Ingredients (Organic, natural, low sugar, vegan, gluten-free,) Health Benefits( Probiotics, antioxidants, gut health, immunity boost,) Carbonation Level (Light, medium, strong, Alcohol) Content (Non-alcoholic, low-alcohol), Packaging (Glass bottle, can, plastic bottle,) Certifications (Organic, Fairtrade, Kosher), Region like Coastal, inland, mountainous, Climate such as Tropical, temperate, cold, Locality, Influences taste preferences, Cultural Factors, consumption habits, Similar products, competitive analysis, Tailored recommendations based on preferences, Vegan, gluten-free, keto-friendly, Diabetes, digestive issues, Demographics, psychographics, behavior, Understand customer behavior, Identify patterns and trends, Style( Athletic, casual, trendy, minimalist), Fabric( Cotton, polyester, spandex, nylon, bamboo), Fit( Tight, loose, compression, relaxed), Color( Solid, patterned, bright, pastel), Design( Basic, embellished, functional), Features( Moisture-wicking, breathable, quick-drying, supportive), Price Point( Budget, mid-range, luxury), Lifestyle (Active, sedentary, health-conscious), Body Type (Slim, athletic, curvy, plus-size), Performance, comfort, style, ethics,  Health-conscious, environmentally friendly, body positive, Weight loss, flexibility, strength, Style, color, pattern and also very important keywords related to product as per title and description

                                    Example:
                                    [{
                                      productName: ${product.productTitle},
                                      keyWords: [${product.productTitle.split(" ")}]
                                    }]
                                `
                                }
                            ]
                        }
                    ]
                };

                const configs = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const result = await axios.post(url, dataBody, configs);
                const text = result.data.candidates[0].content.parts[0].text;
                // refundQuestions = result.data.candidates[0].content.parts[0].text;

                try {
                    const jsonText = text.replace(/json|/g, '').trim();
                    const jsonStartIndex = jsonText.indexOf('[');
                    const jsonEndIndex = jsonText.lastIndexOf(']') + 1;
                    const jsonString = jsonText.slice(jsonStartIndex, jsonEndIndex);

                    const parsedData = JSON.parse(jsonString);
                    response.push({
                        ...produsts,
                        clerkId: clerkAuth.userId,
                        keywords: parsedData[0]
                    });

                    const {
                        productId,
                        productTitle,
                        productDescription,
                        productCreated,
                        status,
                        productHandle,
                        price,
                        imageSrc,
                    } = product;


                    await new ProductsModel({
                        productId,
                        productTitle,
                        productDescription,
                        productCreated,
                        status,
                        productHandle,
                        price,
                        imageSrc,
                        clerkId: clerkAuth.userId,
                        keywords: parsedData[0].keyWords
                    }).save();

                    // refundQuestions = parsedData
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }

            } catch (e) {
                console.error("Error while fetching refund questions:", e);
            }
        }
    }

    return response;
}

function findIdealAnswer(query:string, idealAnswers: Array<{
    question: string,
    answer: string,
    keywords: string[]
}>) {
    query = query.toLowerCase();
    const queryWords = query.split(" ");
    let bestMatch:{
        question?: string,
        answer?: string,
        keywords?: string[]
    } = {};
    let maxMatches = 0;

    idealAnswers.forEach(answerObj => {
        let matchCount = 0;

        answerObj.keywords.forEach(keyword => {
            const splitKeywords = keyword.toLowerCase().split(" ");

            splitKeywords.forEach(word => {
                if (queryWords.includes(word)) {
                    matchCount++;
                }
            });
        });

        if (matchCount > maxMatches) {
            maxMatches = matchCount;
            bestMatch = answerObj;
        }
    });

    return bestMatch ? bestMatch : "false";
}


export async function getResponse(
    snippetId: string,
    query: string,
    prevContext?: any,
): Promise<any> {

    const resolved = false;

    const snippet = await Snippet.findOne({snippetId});
    if(!snippet){
        throw new Error("snippet not found")
    }
    const clerkId = snippet?.clerkId;

    if(!clerkId){
        return "We are currently unavailable for some movement"
    }

    if(
        !resolved && 
        (query.includes("refund") || query.includes("return"))
    ){
        // return refund
        // const query1 = "I need to know about refund policy";
        // const query2 = "I want to know about my order status";
        // const query3 = "check status of my recent order";

        const idealAnswers = await RefundPolicyQuestion.findOne({clerkId})
        const idealAnswerArray = idealAnswers?.refundQuestions;
        if(idealAnswerArray){
           const answer = findIdealAnswer(query, idealAnswerArray)
           return {
            context: "refund/return",
            answer
           }
        }

        // if (query.includes("order") && query.includes("status")) {
        //     return { intent: "order status" };
        // }

    }

    // about company
    // track order
    // support contact
   
    // product recommendation
    // Business hours
    // Store location
    // Similar products
    // Shipping and delivery




}


export async function returnHi(): Promise<any> {
    return "Hii"
}
