/*
test: Create booking
Request type: Post
Request body : Random (Dynamic data using faker library)

// install faker libaray for dynamic data
    sudo npm install @faker-js/faker

    install luxon is a library  for working with dates and times in typescript
// npm install luxon

*/

import { test, expect, request } from "@playwright/test"
import {faker} from "@faker-js/faker"
import { DateTime } from "luxon"

test("Create Post request using faker libray", async ({ request }) => {

    // read data by faker library
    const firstname=faker.person.firstName();
    const lastname=faker.person.lastName();
    const totalprice=faker.number.int({min:500,max:5000});
    const depositpaid=faker.datatype.boolean();
    const checkin=DateTime.now().toFormat("yyyy-MM-dd")
    const checkout=DateTime.now().plus({days:5}).toFormat("yyyy-MM-dd")
    const additionalneeds="Breakfast";

    // request body
    const requestBody = {
        firstname: firstname,
        lastname: lastname,
        totalprice: totalprice,
        depositpaid: true,
        bookingdates: {
            checkin: checkin,
            checkout: checkout
        },
        additionalneeds: additionalneeds
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


// npx playwright test tests/Apitesting/post_api_byFakerLibrary.spec.ts

/* ================= Output ===============
[chromium] › tests/Apitesting/post_api_by_fakerLibrary.spec.ts:18:5 › Create Post request using faker libray
{
  bookingid: 2017,
  booking: {
    firstname: 'Paige',
    lastname: 'Corwin',
    totalprice: 2458,
    depositpaid: true,
    bookingdates: { checkin: '2026-02-22', checkout: '2026-02-27' },
    additionalneeds: 'Breakfast'
  }
}

*/