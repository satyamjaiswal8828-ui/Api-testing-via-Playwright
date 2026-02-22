import {test,expect} from "@playwright/test"
import { it } from "node:test";
test("Get booking details by Id-path param",async({request})=>{
    const bookingId=1; // we can add this as path parameter
    // sending get request along with path parameter
    const response=await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);

    //parse the response and print
    const responseBody=await response.json();
    console.log(responseBody)

    // add assertions
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    //  response body attributes
    expect(responseBody).toHaveProperty("firstname")
     expect(responseBody).toHaveProperty("lastname")
      expect(responseBody).toHaveProperty("additionalneeds")


})


test.only("Get booking details by query param",async({request})=>{
    const firstName="Jim"; // we can add this as query parameter
    const lastName="Brown";
    // sending get request along with path parameter
    const response=await request.get('https://restful-booker.herokuapp.com/booking',{params:{firstName,lastName}});

    //parse the response and print
    const responseBody=await response.json();
    console.log(responseBody)

    // add assertions
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    //  check response should not empty
    expect(responseBody.length).toBeGreaterThan(0);
    for(const item of responseBody)
    {
        expect(item).toHaveProperty("bookingid");
        expect(typeof item.bookingid).toBe("number")
        expect(item.bookingid).toBeGreaterThan(0);
    }

})