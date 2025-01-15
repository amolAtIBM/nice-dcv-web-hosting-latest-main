import "./dcvjs/dcv.js"
import { validateAndFormatUrl } from './url-handler.js';
import dcv from "./dcvjs/dcv.js"

let r, serverUrl, connection, currentAuth;

export function main() {
  console.log("Setting log level to INFO");
  dcv.setLogLevel(dcv.LogLevel.INFO);
  
  r = document.getElementById("inputBar");
  r.addEventListener('input', handleUrlChange);
  
  // Initial URL check
  handleUrlChange({ target: r });
}

function handleUrlChange(event) {
  const inputUrl = event.target.value; // Rename to avoid overwriting `URL`

  // Clear existing connection and auth if URL is empty
  if (!inputUrl || inputUrl.trim() === '') {
    if (connection) {
      connection.close();
      connection = null;
    }
    if (currentAuth) {
      currentAuth.abort();
      currentAuth = null;
    }
    serverUrl = null;
    return;
  }

  serverUrl = inputUrl.trim();
  startConnection();
}


import { checkNetworkStatus, isPortReachable } from './connection-helpers.js';

async function startConnection(retryCount = 0) {
  if (!serverUrl) return;
  
  const MAX_RETRIES = 0;
  const RETRY_DELAY = 3000; // 3 seconds
  
  // Check network status before attempting connection
  const networkStatus = checkNetworkStatus();
  console.log("Network status:", networkStatus);
  
  if (!networkStatus.online) {
    document.getElementById("error").textContent = "No network connection. Please check your internet connection.";
    return;
  }
  
  // Close existing connection before starting a new one
  if (connection) {
    connection.close();
    connection = null;
  }
  
  console.log("Starting authentication with", serverUrl, "attempt:", retryCount + 1);

  if (currentAuth) {
    currentAuth.abort();
  }
  
  console.log(">>>>Attempting to authenticate with server URL:", serverUrl);
  
  try {
    // Reset any existing error messages
    document.getElementById("error").textContent = "";
    
    // Validate and format the URL using the existing handler
    let formattedUrl;
    try {
        formattedUrl = validateAndFormatUrl(serverUrl);
        if (!formattedUrl) {
            throw new Error('URL validation failed');
        }
        // Test URL construction
        new URL(formattedUrl);
    } catch (e) {
        console.error('Invalid URL format:', e);
        document.getElementById("error").textContent = "Invalid server URL format";
        return;
    }
    
    console.log("Using validated URL:", formattedUrl);
    
    currentAuth = dcv.authenticate(
        formattedUrl,
      {
        promptCredentials: onPromptCredentials,
        ignoreCertificateValidation: true,
        retryOptions: {
          maxAttempts: 1,
          initialDelayMs: 1000,
          maxDelayMs: 5000
        },
        error: (auth, error) => {
          console.error("Authentication error details:", {
            serverUrl: serverUrl,
            errorMessage: error.message || error,
            errorStack: error.stack,
            timestamp: new Date().toISOString()
          });
          
          // Show more helpful message for certificate issues
          if (error.toString().includes('certificate') || error.toString().toLowerCase().includes('ssl')) {
            document.getElementById("error").textContent = 
              "Certificate validation error. This may be due to a self-signed certificate. " +
              "Please ensure you've accepted any security warnings in your browser before connecting.";
          } else {
            onError(auth, error);
          }
        },
        success: onSuccess
      }
    );
  } catch (e) {
    console.error("Exception during authentication setup:", e);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY}ms...`);
      setTimeout(() => startConnection(retryCount + 1), RETRY_DELAY);
    } else {
      console.error("Max retry attempts reached");
      document.getElementById("error").textContent = 
        "Unable to connect after multiple attempts. Please check your network connection and server status.";
    }
  }
}

function onError(auth, error) {
  console.error("Error during the authentication: " + error.message);
  if (error.message.includes('WebSocket connection')) {
    console.log("Connection failed. Please check the URL and ensure the server is running.");
  }
}

function onSuccess(auth, result) {
  console.log("Authentication successful! Session ID:", result.sessionId);
  connect(result.sessionId, result.authToken);
}

async function connect(sessionId, authToken) {
  console.log("Connecting with session:", sessionId);

  dcv.connect({
    url: serverUrl,
    sessionId: sessionId,
    authToken: authToken,
    divId: "dcv-display",
    ignoreCertificateValidation: true,
    transportOptions: {
      webSocket: {
        protocols: ['binary'],
        handshakeTimeoutMs: 10000,
        reconnect: true,
        maxRetries: 3
      }
    },
    callbacks: {
      firstFrame: () => console.log("First frame received"),
      error: (error) => {
        console.error("Connection error:", error);
        // Check if the error is WebSocket related
        if (error.toString().includes('WebSocket')) {
          document.getElementById("error").textContent = 
            "WebSocket connection failed. Please ensure your firewall allows WebSocket connections " +
            "and the server is accessible. Error: " + error;
        }
      }
    }
  }).then(function (conn) {
    console.log("Connection established!");
    connection = conn;
    console.log('connection',JSON.stringify(connection));
    // Set up display and input handling
    const display = document.getElementById("dcv-display");
    if (display) {
        display.addEventListener("click", () => {
            if (connection && connection.enterRelativeMouseMode) {
                connection.enterRelativeMouseMode();
                console.log("Entered relative mouse mode");
            }
        });
    } else {
        console.error("Display element not found");
    }
  }).catch(function (error) {
    console.error("Connection failed:", error);
  });
}

function onPromptCredentials(auth, credentialsChallenge) {
  console.log("Prompting for credentials:");
  //createLoginForm();
  credentialsChallenge.respondWith("administrator", "9WrH%xhm6UZ)9zmVMhMYlCUC&o1BLEds@@@");
}