export const readAsDataUrl = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = (ev) => {
        console.log(ev, reader.result);
        resolve(reader.result);
    };
    reader.onerror = () => reject("Could not load the file");
    reader.onprogress = (ev) => console.log(ev);
});