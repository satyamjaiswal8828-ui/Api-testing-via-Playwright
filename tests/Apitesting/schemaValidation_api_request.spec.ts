/*
Prequesties
Intsall the required package
    sudo npm install --save-dev playwright ajv

AJV is used to JSON schema validator

*/

import {test, expect} from "@playwright/test"
import Ajv from "ajv"

test("Validate JSON schema ", async({request})=>{

    const response=await request.get("https://mocktarget.apigee.net/json");
    const responseBody=await response.json()
    console.log(responseBody)

    // OUTPUT => { firstName: 'John', lastName: 'Doe', city: 'San Jose', state: 'CA' }

    const schema={
        type:'object',
        properties: {
    firstName: {  "type": "string" },
    lastName: {  "type": "string"},
    city: {  "type": "string"},
    state: {  "type": "string"}
  },
  required:['firstName','lastName','city','state'],
  additionalProperties:false,
    };
    const ajv=new Ajv()
    const validate=ajv.compile(schema) // ajv.compile(schema) returns a validator function
     console.log("check validator schema",validate)
   const isValid= validate(responseBody) // validate data checks if the response matches the schema
   console.log(isValid);
   expect(isValid).toBeTruthy();

})
/*

{ firstName: 'John', lastName: 'Doe', city: 'San Jose', state: 'CA' }
check validator schema <ref *2> [Function: validate10] {
  errors: null,
  schema: {
    type: 'object',
    properties: {
      firstName: [Object],
      lastName: [Object],
      city: [Object],
      state: [Object]
    },
    required: [ 'firstName', 'lastName', 'city', 'state' ],
    additionalProperties: false
  },
  schemaEnv: <ref *1> SchemaEnv {
    refs: {},
    dynamicAnchors: {},
    schema: {
      type: 'object',
      properties: [Object],
      required: [Array],
      additionalProperties: false
    },
    schemaId: '$id',
    root: [Circular *1],
    baseId: '',
    schemaPath: undefined,
    localRefs: {},
    meta: undefined,
    '$async': undefined,
    validateName: ValueScopeName {
      str: 'validate10',
      prefix: 'validate',
      value: [Object],
      scopePath: [_Code]
    },
    validate: [Circular *2]
  }
}
true
  1 passed */

  