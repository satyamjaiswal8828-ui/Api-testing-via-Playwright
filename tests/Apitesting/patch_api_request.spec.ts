/*
Prequiste ->
    data : from JSON
    crete token

1.Create a booking  (Pqtch)-> bookingID
2.Create token
3.  Partial Update booking (put) -> requires token

*/


import { test, expect, request } from "@playwright/test"
import { it } from "node:test";
import fs from 'fs';


// utility function returns json file data
function readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

test('Partial update Booking (Patch)', async ({ request }) => {

    // Create Booking (Post )---> BookingID
    const requestBody = readJson('testData/post_request_body.json')
    const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', { data: requestBody })
    expect(createResponse.ok()).toBeTruthy();


    const responseBody = await createResponse.json();
    console.log(responseBody);
    const bookingId = responseBody.bookingid; // extracting bookingid from responseBody
    console.log("BookingId   =========> ", bookingId);


    // 2.  Partial Update booking (Patch) -> requires token

    // token creation

    const tokenRequestBody = readJson('testData/token_request_body.json')
    const tokenResponse = await request.post('https://restful-booker.herokuapp.com/auth', { data: tokenRequestBody });
    expect(tokenResponse.ok()).toBeTruthy();

    const createTokenBody = await tokenResponse.json();
    const token = createTokenBody.token;
    console.log("token =====>", token);
    expect(createTokenBody).toHaveProperty('token');

    // sending update (Patch)
    const patchRequestBody = readJson('testData/patch_request_body.json')
    const patchResponse = await request.patch(
        `https://restful-booker.herokuapp.com/booking/${bookingId}`,
        {
            data: patchRequestBody,
            headers: {
                "Cookie": `token=${token}`,
                "Content-Type": "application/json"
            }
        }
    )
    expect(patchResponse.ok()).toBeTruthy();
    expect(patchResponse.status()).toBe(200);
    const patchResponseBody = await patchResponse.json()
    console.log(patchResponseBody)

    console.log("Booking details partially updated successfully");

})


/*
    ====================== OUTPUT =======================
{
  bookingid: 4495,
  booking: {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
    additionalneeds: 'Breakfast'
  }
}
BookingId   =========>  4495
token =====> 82055cf237d341f
{
  firstname: 'Shivam',
  lastname: 'Jaiswal',
  totalprice: 111,
  depositpaid: true,
  bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
  additionalneeds: 'Grapes'
}
Booking details partially updated successfully
  1 passed (3.1s)

  */