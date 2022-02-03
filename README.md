# Zod Drop

## Description

Make funding NEAR wallets easy and claiming ZOD Tokens hassle free.  
  
https://drop.zod.tv

### Notes

```
Init your dropper account and send it some basic balance depending on event size.

echo "drop.zod.near" | wrangler secret put ACCOUNT
echo "ed25519:..." | wrangler secret put SECKEY

wrangler secret delete ACCOUNT
wrangler secret delete SECKEY
```