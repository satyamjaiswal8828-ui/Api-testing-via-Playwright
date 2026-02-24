/*
1) No auth
2) Basic auth/ Preemptive auth (username & password)
3) Bearer token
4) API key authentication

*/

import {test,expect} from "@playwright/test"
// 1) No auth

test('Verify public api -no auth ',async({request})=>{

    const response=await request.get("https://jsonplaceholder.typicode.com/posts/1");
    const responseBody=await response.json()
    console.log(responseBody)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
})

/*  ================= Output =========================
{
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\n' +
    'suscipit recusandae consequuntur expedita et cum\n' +
    'reprehenderit molestiae ut ut quas totam\n' +
    'nostrum rerum est autem sunt rem eveniet architecto'
}
   */

// 2) Basic auth

test('Verify Basicauth ',async({request})=>{

    const response=await request.get("https://httpbin.org/basic-auth/user/pass",{
        headers:{
            Authorization:`Basic `+Buffer.from("user:pass").toString('base64')
        }
    });
   expect(response.ok()).toBeTruthy();
   expect(response.status()).toBe(200);

})

// 3) Bearer Token
// returns repos created by user

test('Verify Bearer Token ',async({request})=>{
    const bearerToken="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sat"
    const response=await request.get("https://api.github.com/user/repos",{
        headers:{
            Authorization:`Bearer ${bearerToken}`
        }
    });
    const responseBody=await response.json()
    console.log(responseBody);
   expect(response.ok()).toBeTruthy();
   expect(response.status()).toBe(200);

})

// return user information
//2

test.only('Verify Token Authenication ',async({request})=>{
    const bearerToken="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sat"
    const response=await request.get("https://api.github.com/user",{
        headers:{
            Authorization:`Bearer ${bearerToken}`
        }
    });
    const responseBody=await response.json()
    console.log(responseBody);
   expect(response.ok()).toBeTruthy();
   expect(response.status()).toBe(200);

})





