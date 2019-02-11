import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';

import { AESService } from './core/services/aes.service';


@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private _aes: AESService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {
    // if (request.body) {
    //   var encryptValue = this.encrypt(request.body);
    //   request = request.clone({
    //     url: '/rest' + request.url,
    //     setParams: {
    //       'access_token': localStorage.getItem('access_token'),
    //       'openid': localStorage.getItem('openid')
    //     },
    //     body: {data:encryptValue}
    //   });
    // } else {
        
      if(request.url.slice(1,7) == 'assets'){

        request = request.clone({
          url: request.url,
          setParams:null
        });

      }else{

        let _body = request.body;
        // Encrypt every post data modified by loudon 2019-02-10
        if( request.method != 'GET' && _body != null && 1 != 1){

          if (typeof _body == 'object') {
            _body = JSON.stringify(_body);
          }
          _body = this._aes.getEncrypt(_body);
        }

        let _url = '/rest' + request.url;

        if(request.url.slice(1,7) == 'oauth2'){
          request = request.clone({
            url: _url
          });

        }else{

          request = request.clone({
            url: _url,
            setParams: {
              'access_token': localStorage.getItem('access_token'),
              'openid': localStorage.getItem('openid')
            },
            setHeaders: {
              'Token': localStorage.getItem('access_token'),
              'Signature': localStorage.getItem('signature')
            },
            body: {
              'data': _body
            }
          });
        }
      }  
    // }

    return next.handle(request)
      .do(

          (rep: any) =>{
              if( rep.status === 200){
               
                // Decrypt every get data modified by loudon 2019-02-10
				if( request.url.slice(1,7) == 'oauth2' && rep.body['code'] == 1 && rep.body['data'] != null && rep.body['data'].length > 0 ){

					try{

                        let _data = rep.body['data'];
                        if( typeof _data == 'object')
                        {
                            _data = JSON.stringify(_data);
                        }

                        _data = this._aes.getDecrypt( _data );
                        _data = JSON.parse(_data);

                        rep.body['data'] = _data;

					}catch(e){
						console.log( e );
					}
                }
				
                return rep;
              }
          },

          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                this._router.navigate(['signin']);
                return;
              }
            }
          }

      );
  }



}
