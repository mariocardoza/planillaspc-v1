import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  public encrypt(id: string): string {
    let hasSpecial = false;
    let idEncrypted;
    do {
      idEncrypted = crypto.AES.encrypt(JSON.stringify({ id }), 'EPlanilla').toString();
      hasSpecial = false;
      for (let i = 0; i < idEncrypted.length; i++) {
        const character = idEncrypted.charAt(i);
        if (character == '/') hasSpecial = true;
        if (character == '%') hasSpecial = true;
      }
    } while (hasSpecial == true);
    return idEncrypted;
  }


  decrypt = (encryptedId: string): string => {
    return JSON.parse(crypto.AES.decrypt(encryptedId, 'EPlanilla').toString(crypto.enc.Utf8)).id;
  }
}
