console.log("Assessment started");

import fetch from 'node-fetch';
import fs from 'fs';

import mongo from 'mongodb';
const { writeFile, readFile } = fs.promises;

const { MongoClient } = mongo

import { uploadFile } from "./s3Client.js";


async function savePDFtoS3(data){
    const baseURL = "https://prod-bl.qp.akasaair.com//api/ibe/gst/invoice/download?"
    data.forEach(async (item) => {
        const apiURL = baseURL + 'pnr=' + item.pnr + 'lastName=' + item.lastName;
        const path = "files/";
        const response = await fetch(apiURL);
        const buffer = await response.buffer();
        await writeFile(path + `taxInvoice-${item.pnr}-${item.lastName}.pdf`, buffer);
        uploadFile(path + `taxInvoice-${item.pnr}-${item.lastName}.pdf`);
    });
}

async function generatePdfForAkasa(client){
    client.connect((err, db) => {
        if(err) {
            console.error(err)
        }
        const db_obj = db.db('airlines');
        db_obj.collection('akasa_input').find({}).toArray(async (err, result) => {
            if(err) {
                console.error(err)
            }
            await savePDFtoS3(result);
        });
    })
}

async function main(){
    const uri = "mongodb+srv://subh2711:Subhashis@cluster0.ompjetk.mongodb.net/airlines?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // await client.connect();
        // await listDatabases(client);

        await generatePdfForAkasa(client);
    }catch(err){
        console.error(err);
    }finally{
        await client.close(); 
    }
}

main().catch(console.error);