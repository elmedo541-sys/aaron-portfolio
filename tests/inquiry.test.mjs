import {test} from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/inquiry.js';
const body={name:'Test Visitor',email:'visitor@example.com',subject:'Project inquiry',message:'Hello Aaron',website:''};
async function invoke(changes={}){const req={method:'POST',headers:{origin:'https://portfolio.example',host:'portfolio.example','content-type':'application/json'},body:{...body},...changes};const res={code:200,setHeader(){},status(n){this.code=n;return this},json(value){this.value=value;return this}};await handler(req,res);return res;}
test('inquiry validation and provider behavior',async()=>{const key=process.env.RESEND_API_KEY;const fetchOriginal=globalThis.fetch;try{
assert.equal((await invoke({method:'GET'})).code,405);
assert.equal((await invoke({headers:{origin:'https://other.example',host:'portfolio.example'}})).code,403);
assert.equal((await invoke({body:{...body,email:'bad'}})).code,400);
assert.equal((await invoke({body:{...body,message:'x'.repeat(4001)}})).code,400);
assert.equal((await invoke({body:{...body,website:'spam'}})).code,400);
delete process.env.RESEND_API_KEY;assert.equal((await invoke()).code,503);
process.env.RESEND_API_KEY='test-placeholder';globalThis.fetch=async(url,opts)=>{assert.equal(url,'https://api.resend.com/emails');const payload=JSON.parse(opts.body);assert.deepEqual(payload.to,['elmedo541@gmail.com']);assert.equal(payload.reply_to,body.email);return {ok:true,json:async()=>({id:'mock'})}};assert.equal((await invoke()).value.ok,true);
globalThis.fetch=async()=>({ok:false});assert.equal((await invoke()).code,502);
globalThis.fetch=async()=>{throw new Error('timeout')};assert.equal((await invoke()).code,502);
}finally{globalThis.fetch=fetchOriginal;if(key===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=key}});
