import axios from 'axios';
import ShopifyIntegration from '../models/shopifyIntegration.model';

export async function integrateShopify(clerkAuth: any,
    body: {
        shopifyURL: string;
        accessToken: string;
        email?: string;
    }): Promise<any> {

    // console.log(clerkAuth);
    // return true;

    const shopifyURL = `${body.shopifyURL}/admin/api/2024-07/products/count.json`
    const config = {
        method: 'get',
        url: shopifyURL,
        headers: {
            'X-Shopify-Access-Token': body.accessToken
        }
    };

    let isValid = false;
    let msg = "";

    try {
        await axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                isValid = true;
                msg = "Successfully Intergated"
            })
            .catch(function (error) {
                console.log(error);
                isValid = false;
                msg = "Unsuccessfull to Intergate"

            });
    } catch (e) {
        isValid = false;
        msg = "Something went wrong" + String(e)
        console.error("")
    }

    if (isValid) {
        try {
            await new ShopifyIntegration({
                clerkId: clerkAuth.userId,
                shopifyURL: body.shopifyURL,
                accessToken: body.accessToken,
                status: "Active"
            }).save();
        } catch (e) {
            isValid = false;
            msg = "Internal Server Error" + String(e)
        }
    }

    return {
        isValid, msg
    }
}

export async function getProducts(clerkAuth: any): Promise<any> {
    const data = await ShopifyIntegration.findOne({
        clerkId: clerkAuth.userId,
        status: "Active"
    })

    if (!data) {
        throw new Error("ShopifyIntegration not found");
    }

    const shopifyURL = `${data.shopifyURL}/admin/api/2024-07/products.json`
    const config = {
        method: 'get',
        url: shopifyURL,
        headers: {
            'X-Shopify-Access-Token': data.accessToken
        }
    };

    try {
        const result = await axios(config);
        const allProducts = result.data.products;


        return allProducts?.map((product: {
            handle: any; id: any; title: any; body_html: any; created_at: any; status: any; variants: { price: any; }[]; image: { src: any; };
        }) => ({
            productId: product?.id,
            productTitle: product?.title,
            productDescription: product?.body_html,
            productCreated: product?.created_at,
            status: product?.status,
            productHandle: product?.handle,
            price: product?.variants?.[0]?.price,
            imageSrc: product?.image?.src
        })) as Array<
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
        >;
    } catch (e) {
        throw new Error("Something went wrong --> " + e as string)
    }
}
