import JSZip from "jszip";
import saveAs from "file-saver";
import { helper } from "./Helper";
export const saveToZip = (filename, urls) => {
    const zip = new JSZip();
    let now = new Date().toDateString();
    return new Promise((resolve, reject) => {
        const folder = zip.folder(`awavideo-${helper.generateIdentifier()}-${now.replace(/\s+/g, '-').toLowerCase()}`);
        urls.forEach((url) => {
            const blobPromise = fetch(url).then(r => {
                if (r.status === 200) {
                    return r.blob();
                } else {
                    return Promise.reject(new Error(r.statusText));
                }
            });

            const name = url.substring(url.lastIndexOf('/'));
            const fIndex = name.indexOf('?');
            const fileName = name.substring(0, fIndex)
            folder.file(fileName, blobPromise);
        });

        zip.generateAsync({
                type: "blob"
            })
            .then(blob => {
                saveAs(blob, filename);
                resolve();
            })
            .catch(e => {
                reject(e);
            });
    });
}