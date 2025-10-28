export const getSessionStorageItem = (key: string): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return sessionStorage.getItem(key);
}

export const setSessionStorageItem = (key: string, value: string): void => {
    if (typeof window === 'undefined') {
        return;
    }

    sessionStorage.setItem(key, value);
}

export const removeSessionStorageItem = (key: string): void => {
    if (typeof window === 'undefined') {
        return;
    }

    sessionStorage.removeItem(key);
}
