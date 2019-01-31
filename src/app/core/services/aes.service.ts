import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
declare var Buffer: any;

@Injectable()
export class AESService {

    private appId :string;
    private app_secret :string;
    private aesKey :string;
    private iv: string;

    constructor() {

        //需要从配置文件中读取
        this.appId = "wxb11529c136998cb6";
        this.app_secret = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG";

        //this.aesKey = new Buffer(this.app_secret + '=', 'base64');

        this.aesKey = CryptoJS.enc.Base64.parse( this.app_secret + '='  );

        //this.aesKey = this.app_secret + '=';
//            CryptoJS.enc.Base64.parse(this.app_secret + '=');
        this.iv = CryptoJS.lib.WordArray.create( CryptoJS.enc.Base64.parse( this.app_secret ).words, 16);

    }

    //获取当前调用接口的验签
    public getSignature(token, timestamp, nonce) {

        return this._signature(token, timestamp, nonce);

    };

    public encrypt(value: any) {
        if (typeof value == 'object') {
            value = JSON.stringify(value);
        }
        var encryptValue = CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse("1234567890123456"), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        return encryptValue;
    }

    //加密数据提交到接口，加密前，需要将 json object 序列化为 text #modified by loudon 2019-01-30
    public getEncrypt(text: string){
        return this._encrypt(text) ; //this._encrypt(text);
    }

    //从接口中获取数据后进行解密，解密完后需要将 json text 反序列化为 object #modified by loudon 2019-01-30
    public getDecrypt(text: string){
        return this._decrypt(text);
    }

	//获取 oauth 的 token 后, 需要后面数据接口中增加  Signature 参数提交才能正常返回加密数据 #modified by loudon 2019-01-30
    private _signature(token, timestamp, nonce){

        let raw_signature = [token, timestamp, nonce].sort().join('');
        let result = CryptoJS.SHA1(raw_signature);

        return result.toString();

    }

    private _decrypt(text: string){

        let decryptResult;
        try {

            // 解密
            let bytes = CryptoJS.AES.decrypt( text , this.aesKey, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            decryptResult = bytes.toString(CryptoJS.enc.Utf8);

            let buff = Buffer(decryptResult);

            buff = this.decoder(buff);

            if( buff.length < 16)
                return null;

            let content = buff.slice(16);

            let len = content.slice(0,4).readUInt32BE(0);

            let result = content.slice(4, len + 4).toString();
            let appId = content.slice(len + 4).toString();

            if (appId != this.appId)throw new Error('appId is invalid');

            return result;


        } catch (err) {

            console.log(err)

        }


        if (decryptResult.watermark.appid !== this.appId) {
            console.log('not auth');
        }

        return decryptResult


    }


    private _encrypt(text: string){

        if (typeof text == 'object') {
            text = JSON.stringify(text);
        }

        //let srcs = CryptoJS.enc.Utf8.parse(text);

        let random16 = CryptoJS.enc.Latin1.parse(this.getRandomStr());

        let msg = CryptoJS.enc.Utf8.parse(text);

        let msgLength = CryptoJS.enc.Hex.parse(("00000000" + Math.ceil(msg.sigBytes).toString(16)).slice( - 8));

        let corpId = CryptoJS.enc.Latin1.parse(this.appId);

        try {

            let raw_text = random16.concat(msgLength).concat(msg).concat(corpId);

            let encrypted = CryptoJS.AES.encrypt(raw_text, this.aesKey, {
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return encrypted.toString();

        }catch(err){

            console.log( err );
            return null;

        }
    }

    private decoder(buff) {

        var pad = buff[buff.length - 1];
        if (pad < 1 || pad > 32) {
            pad = 0;
        }
        return buff.slice(0, buff.length - pad);

    }

    private encoder(buff) {

        let blockSize = 32;
        let strSize = buff.length;
        let amountToPad = blockSize - (strSize % blockSize);
        let pad = new Buffer(amountToPad-1);
        pad.fill(String.fromCharCode(amountToPad));
        return Buffer.concat([buff, pad]);

    }

    /**
     * 随机生成16位字符串
     * @return string 生成的字符串
     */
    private getRandomStr()
    {

        let str = "";
        let str_pol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        let max = str_pol.length - 1;

        for (let f = 0; 16 > f; f++)
            str += str_pol[Math.floor(Math.random() * str_pol.length)]

        return str;
    }

}