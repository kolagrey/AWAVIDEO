export const helper = {
    generateIdentifier: () => {
        const now = new Date().getTime().toString();
        const charset = 'abcdef0123456789';
        let text = '';
        const len = 32;
        for (let i = 0; i < len; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return text + now;
    }
}