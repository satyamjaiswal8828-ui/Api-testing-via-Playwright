/*
1)-> Create a new booking
2)-> get booking
3)-> update booking (token needed )
4)-> delete booking (token needed)

*/

import { test, expect, request } from "@playwright/test"
import fs from 'fs';

// utility function returns json file data
function readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

test('Delete booking (end to end ', async ({ request }) => {

    // 1) Create a new booking
    const postRequestBody = readJson('testData/post_request_body.json')
    const postResponse = await request.post("https://restful-booker.herokuapp.com/booking", { data: postRequestBody });
    const postResponseBody = await postResponse.json();  // Extracted response
    console.log(postResponseBody);

    const bookingid = postResponseBody.bookingid;
    console.log("Booking is created")
    console.log("BookingId =====>", bookingid)

    // 2) get booking
    const getresponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingid}`)
    const getResponseBody =await  getresponse.json();
    console.log("Booking details are ....... ")
    console.log(getResponseBody)

    // 3)-> update booking 

    // create token
    const tokenRequestBody = readJson('testData/token_request_body.json')
    const tokenResponse = await request.post('https://restful-booker.herokuapp.com/auth', { data: tokenRequestBody });
    expect(tokenResponse.ok()).toBeTruthy();

    const createTokenBody = await tokenResponse.json();
    const token = createTokenBody.token;
    console.log("token =====>", token);
    expect(createTokenBody).toHaveProperty('token');


     // sending put request
    const updateRequestBody = readJson('testData/put_request_body.json')
    const updateResponse = await request.put(
        `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        {
            data: updateRequestBody,
            headers: {
                "Cookie": `token=${token}`,
                "Content-Type": "application/json"
            }
        }
    )

    const updateResponseBody = await updateResponse.json()
    console.log(updateResponseBody)
    console.log("Booking details updated successfully");


    // 4)-> delete booking (token needed)
   const deleteResponse= await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingid}`,{
        headers: {
                "Cookie": `token=${token}`,
                "Content-Type": "application/json"
            }
        }
    )
    expect(deleteResponse.statusText()).toBe("Created")
    expect(deleteResponse.status()).toBe(201);
    console.log("Booking deleting successfully")
})



/*


[chromium] › tests/Apitesting/delete_api_request.spec.ts:17:5 › Delete booking (end to end 
{
  bookingid: 2545,
  booking: {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
    additionalneeds: 'Breakfast'
  }
}
Booking is created
BookingId =====> 2545
Booking details are ....... 
{
  firstname: 'Jim',
  lastname: 'Brown',
  totalprice: 111,
  depositpaid: true,
  bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
  additionalneeds: 'Breakfast'
}
token =====> fce04c3af9ba900
{
  firstname: 'Satyam',
  lastname: 'Jaiswal',
  totalprice: 200,
  depositpaid: true,
  bookingdates: { checkin: '2026-01-01', checkout: '2026-02-01' },
  additionalneeds: 'orange'
}
Booking details updated successfully
Booking deleting successfully
  1 passed (4.7s)



  */