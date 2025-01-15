# Certificate and Connection Security Notice

When connecting to the DCV server at `wss://18.212.126.212:8443`, you may encounter certificate validation issues. This is normal if the server is using a self-signed certificate.

## For Users
1. If you see certificate warnings in your browser:
   - Chrome: Click "Advanced" then "Proceed to [site] (unsafe)"
   - Firefox: Click "Advanced" then "Accept the Risk and Continue"
   
2. Before accepting certificate warnings, ensure you trust this DCV server and connection.

## For Administrators
To resolve certificate warnings permanently:
1. Install a valid SSL certificate from a trusted CA
2. Configure the DCV server to use the new certificate
3. Update the certificate path in dcv.conf:
   ```
   [security]
   certificate=/path/to/certificate.pem
   private-key=/path/to/private-key.pem
   ```

## Security Note
The code has been updated to handle self-signed certificates, but it's recommended to use proper SSL certificates in production environments.