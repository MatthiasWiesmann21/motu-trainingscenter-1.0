export async function registerserviceWorker() {
    if (!('serviceWorker' in navigator)) {
        throw Error('Service worker not supported by this browser')
    }
    await navigator.serviceWorker.register('/serviceWorker.js'), {

    }
}

export async function getReadyServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        throw Error('Service worker are not supported by this browser')
    }
    return navigator.serviceWorker.ready;
}