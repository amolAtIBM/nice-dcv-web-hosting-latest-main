// URL validation and handling
function parseUrl(url) {
    try {
        // Simple URL parser that handles the minimal requirements
        // Matches protocol://hostname:port
        const urlPattern = /^(wss?|https?):\/\/([^:/\s]+)(?::(\d+))?/i;
        const match = url.match(urlPattern);
        
        if (!match) {
            throw new Error('Invalid URL format');
        }
        
        return {
            href: url,
            protocol: match[1].toLowerCase() + ':',
            hostname: match[2],
            port: match[3] || '',
            host: match[3] ? `${match[2]}:${match[3]}` : match[2]
        };
    } catch (e) {
        console.error('Error parsing URL:', e);
        return null;
    }
}
function validateAndFormatUrl(url) {
    console.log('Validating URL:', url);
    if (!url || url.trim() === '') {
        console.warn('Empty URL provided');
        return null;
    }
    url = url.trim();
    let formattedUrl;
    
    // Handle both WebSocket and HTTPS protocols
    function formatHttpUrl(input) {
        if (!input.includes('://')) {
            input = 'https://' + input;
        }
        return input.replace(/^ws(s)?:\/\//i, 'https://');
    }

    function formatWsUrl(input) {
        if (!input.includes('://')) {
            input = 'wss://' + input;
        }
        return input.replace(/^https?:\/\//i, 'wss://');
    }
    if (url.startsWith('wss://')) {
        formattedUrl = url;
    } else if (url.startsWith('https://')) {
        formattedUrl = url.replace('https://', 'wss://');
    } else {
        formattedUrl = 'wss://' + url.replace(/^https?:\/\/|^wss?:\/\//, '');
    }
    console.log('Formatted URL:', formattedUrl);
    // Ensure we have the port
    if (!formattedUrl.includes(':8443')) {
        formattedUrl = formattedUrl.replace(/:(\d+)?/, '') + ':8443';
    }
    
    // Add debug logging
    // Safely extract hostname and port
    let urlInfo = { original: url, final: formattedUrl };
    const parsedUrl = parseUrl(formattedUrl);
    if (parsedUrl) {
        urlInfo.hostname = parsedUrl.hostname;
        urlInfo.port = parsedUrl.port;
    } else {
        urlInfo.error = 'Invalid URL format';
    }
    console.log('URL processing:', urlInfo);
    
    console.log('Formatted WebSocket URL:', formattedUrl);
    
    // Pre-validate URL format
    try {
        const url = parseUrl(formattedUrl);
        if (!url) {
            throw new Error('Failed to parse URL');
        }
        if (url.protocol !== 'wss:') {
            console.warn('Warning: URL protocol is not wss:', url.protocol);
        }
        if (!url.port && url.hostname.includes(':')) {
            console.warn('Warning: Port should be specified in the URL port field, not hostname');
        }
    } catch (e) {
        console.error('Invalid URL format:', e);
        return null;
    }
    
    return formattedUrl;
}

export { validateAndFormatUrl };