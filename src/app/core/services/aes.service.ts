import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
const aseKey = '1234567890123456';

@Injectable()
export class AESService {
    constructor() { }

    public encrypt(value:any){
        if (typeof value == 'object'){
            value = JSON.stringify(value);
        }
        var encryptValue = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(aseKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          }).toString();

          return encryptValue;
    }

}