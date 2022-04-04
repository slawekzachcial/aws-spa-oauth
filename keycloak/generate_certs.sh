#!/bin/bash -xe

openssl genrsa -out key.pem 2048
openssl req -new -out csr.pem -key key.pem -subj /CN=localhost
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
openssl pkcs12 -export -in cert.pem -inkey key.pem -out cert.p12 -name keycloak -CAfile ca.crt -caname root
keytool -importkeystore -deststorepass secret -destkeypass secret -destkeystore keystore.jks -srckeystore cert.p12 -srcstoretype PKCS12 -srcstorepass secret -alias keycloak

echo "SHA1 Fingerprint:"
openssl x509 -in cert.pem -fingerprint -noout | sed -e 's/.*=//' -e 's/://g'
