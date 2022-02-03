# Zod Drop

![image](https://user-images.githubusercontent.com/3028982/152405555-675ec6d2-a0e3-467d-8f2e-bc11fcaea262.png)

## Description

Make funding NEAR wallets easy and claiming ZOD Tokens hassle free.  
  
https://drop.zod.tv

### Notes

Init your dropper account and send it some basic balance depending on event size.
```
echo "drop.zod.near" | wrangler secret put ACCOUNT
echo "ed25519:..." | wrangler secret put SECKEY

wrangler secret delete ACCOUNT
wrangler secret delete SECKEY
```
