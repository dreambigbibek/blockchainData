import fetch from 'node-fetch'
import mongoose from 'mongoose';
const BATCH_SIZE = 1000;
var count=0;


const url = 'mongodb://localhost:27017/wondergamesData';

const connectToDb = async()=>{
    try{
      const connection = await mongoose.connect('mongodb://127.0.0.1:27017/wondergamesData');
      if(connection){
        console.log("connnectd to mongodb")
      }
    }catch(err){
      console.log(err)
    }
  }
  connectToDb()

  const wondergameSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    tokens: { type: [String], required: true }
  });

  
  const Wondergame_model = mongoose.model('Wondergame', wondergameSchema);

//   const test_obj={name:"bibek",id:"123"}

//   Wondergame_model.create(test_obj);





const transfersQuery = `
  query($first: Int!, $skip: Int!,$lastID: String) {
    transfers(first: $first, where: { id_gt: $lastID }) {
      blockNumber
      blockTimestamp
      id
      to
      from
      tokenId
      transactionHash
    }
  }
`;

const getTokenHolders=(transfers)=>{
    var tokenholdersObject={};
    // console.log(transfers.length)
    const tested=transfers.map((item,id)=>{
      tokenholdersObject[item.tokenId]=item.to;
      return item.tokenId
     })


     const walletNfts = {};

     
     for (const token in tokenholdersObject) {
       const holder = tokenholdersObject[token];
       if (walletNfts[holder]) {
         walletNfts[holder].push(token);
       } else {
         walletNfts[holder] = [token];
       }
     }
     
     console.log(walletNfts);
    // console.log(tokenholdersObject)
    keysArray=Object.keys(walletNfts)  //getting the keys of the object and returning the array.
    
    keysArray.map((item,id)=>{

        // item.keys=
    })
    Wondergame_model.create(walletNfts);
  
  }

const getAllTransfers = async () => {
    let transfers = [];
    let skip = 0;
    let hasNextPage = true;
    let lastID='';
  
    while (hasNextPage) {
      const response = await fetch('https://api.thegraph.com/subgraphs/name/dreambigbibek/second_subgraph',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: transfersQuery,
          variables: { first: BATCH_SIZE, skip,lastID },
        }),
      });
    
  
      const { data } = await response.json();
      transfers = transfers.concat(data.transfers);
       count=count+1;
       lastID = transfers[transfers.length - 1].id;
       console.log(lastID)
       if (data.transfers.length !== BATCH_SIZE){
        hasNextPage= false;
        console.log("hasnextpage should be false")
       }
       console.log(data.transfers.length);
    //    hasNextPage = (data.transfers.length == BATCH_SIZE);
       console.log(hasNextPage);
      skip += BATCH_SIZE;
    //   console.log(skip);
    //   getTokenHolders(transfers);
    }
    getTokenHolders(transfers);
//    console.log(transfers)
    return transfers;
};

getAllTransfers();
getTokenHolders
