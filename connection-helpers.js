// Connection helper functions
export function checkNetworkStatus() {
    return {
        online: navigator.onLine,
        connection: navigator.connection ? {
            type: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        } : null
    };
}

export function isPortReachable(url) {
    const wsUrl = new URL(url);
    return new Promise((resolve) => {
        const socket = new WebSocket(url);
        const timeout = setTimeout(() => {
            socket.close();
            resolve(false);
        }, 5000);

        socket.onopen = () => {
            clearTimeout(timeout);
            socket.close();
            resolve(true);
        };

        socket.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
        };
    });
}