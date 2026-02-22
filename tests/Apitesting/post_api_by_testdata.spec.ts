/*
test: Create booking
Request type: Post
Request body : Json

*/

import { test, expect, request } from "@playwright/test"
import fs from 'fs'

test("Create Post request using JSON file", async ({ request }) => {

    // read date from JSON (request body)
    const jsonFile="TestData/post_request_body.json";
    const requestBody:any=JSON.parse(fs.readFileSync(jsonFile,'utf-8'));
    
    // send post request
    const response = await request.post("https://restful-booker.herokuapp.com/booking", { data: requestBody });
    const responseBody = await response.json();  // Extracted response
    console.log(responseBody);


    // validate status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    //validate response body attributes
    expect(responseBody).toHaveProperty("bookingid");
    expect(responseBody).toHaveProperty("booking");
    expect(responseBody).toHaveProperty("booking.additionalneeds"); // we need to pass exact json path

    // validate booking details
    const booking = responseBody.booking;
    expect(booking).toMatchObject({
        firstname: requestBody.firstname,
        lastname: requestBody.lastname,
        totalprice: requestBody.totalprice,
        depositpaid: requestBody.depositpaid,
        additionalneeds: requestBody.additionalneeds
    });
    
    // validate booking dates ( nested object)
    expect(booking.bookingdates).toMatchObject({
            "checkin": requestBody.bookingdates.checkin,
            "checkout": requestBody.bookingdates.checkout
        });
})

// npx playwright test tests/Apitesting/post_api_by_testdata.spec.ts
/* ================= Output ===============
{
  bookingid: 5132,
  booking: {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
    additionalneeds: 'Breakfast'
  }
}

*/