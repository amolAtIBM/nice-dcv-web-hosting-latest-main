# How to Run This Project

## Prerequisites
1. Make sure you have Node.js installed on your system
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Project
This is a web-based application using NICE DCV Web SDK for Desktop Cloud Visualization. Follow these steps to run the project:

1. First install the dependencies:
   ```bash
   npm install
   ```

2. Since this is a web application with index.html and JavaScript files, you'll need to serve it using a web server. You can use any of these methods:

   ### Option 1: Using Node.js http-server (Recommended)
   ```bash
   # First install http-server globally if you haven't
   npm install -g http-server
   
   # Then run the server from the project directory
   http-server
   ```

   ### Option 2: Using Python's built-in server
   ```bash
   # If you have Python installed, run from the project directory:
   python -m http.server 8080
   ```

   ### Option 3: Using PHP's built-in server
   ```bash
   # If you have PHP installed, run from the project directory:
   php -S localhost:8080
   ```

3. After starting the server, open your web browser and navigate to:
   ```
   http://localhost:8080
   ```
   (The port number might be different depending on the server you use)

## Troubleshooting Common Issues

### "main is not defined" error
If you see this error in the console after entering a URL, it's because the JavaScript modules aren't properly loaded. To fix this:

1. Make sure you're using a proper web server (as described above) and not opening the file directly in the browser
2. Check that your browser supports ES modules (modern browsers should support this)
3. Verify that all script tags in index.html have the `type="module"` attribute
4. Clear your browser cache and reload the page
5. Make sure you're using the latest version of your web browser

### Connection Issues
1. Verify that the NICE DCV server is running and accessible
2. Check that the URL you're entering is correct
3. Ensure there are no firewall rules blocking the connection

## Important Notes
- Always serve the application through a web server - don't open the HTML file directly
- Make sure all dependencies are properly installed before running the application
- The application requires the NICE DCV server to be properly configured and accessible
- Check that the DCV SDK dependencies in the dcv-ui and dcvjs folders are properly set up
- Use a modern web browser that supports ES modules