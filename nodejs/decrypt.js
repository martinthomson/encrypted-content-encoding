'use strict';

var base64 = require('urlsafe-base64');
var crypto = require('crypto');
var ece = require('./ece.js');

if (process.argv.length < 7) {
  console.warn('Usage: ' + process.argv.slice(0, 2).join(' ') +
               ' <receiver-private> <receiver-public> <sender-public> <salt> <message>');
  process.exit(2);
}

var receiver = crypto.createECDH('prime256v1');
// node crypto is finicky about accessing the public key
// 1. it can't generate the public key from the private key
// 2. it barfs when you try to access the public key, even after you set it
// This hack squelches the complaints at the cost of a few wasted cycles
receiver.generateKeys();
receiver.setPublicKey(base64.decode(process.argv[3]));
receiver.setPrivateKey(base64.decode(process.argv[2]));
ece.saveKey('keyid', receiver, "P-256");

var result = ece.decrypt(base64.decode(process.argv[6]), {
  keyid: 'keyid',
  dh: process.argv[4],
  salt: process.argv[5]
});

console.log(base64.encode(result));
console.log(result.toString('utf-8'));
