/*
test: Create booking
Request type: Post
Request body : static

*/

import { test, expect, request } from "@playwright/test"

test("Create Post request using static body", async ({ request }) => {

    // request body
    const requestBody = {
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: "2018-01-01",
            checkout: "2019-01-01"
        },
        additionalneeds: "Breakfast"
    }
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
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        additionalneeds: "Breakfast"
    });
    
    // validate booking dates ( nested object)
    expect(booking.bookingdates).toMatchObject({
            "checkin": "2018-01-01",
            "checkout": "2019-01-01"
        });
})



// npx playwright test tests/Apitesting/post_api_request.spec.ts

/*. =================== OUTPUT =====================
{
  bookingid: 3025,
  booking: {
    firstname: 'Jim',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
    additionalneeds: 'Breakfast'
  }
}
 1 passed (1

*/