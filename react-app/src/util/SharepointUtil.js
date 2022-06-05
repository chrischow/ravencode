export class RavencodeFolderData{
    constructor(id, dataName, type, path){
        this.id = id;
        this.dataName = dataName;
        this.type = type;
        this.path = path;
        this.children = [];

        if (type === "file"){
            const match = dataName.match(/\.([a-zA-Z]*$)/);
            this.ext = match ? match[1] : "";
        }
    }

    addChild(child) {
        this.children.push(child);
    }
}

export class SharepointUtil{
    constructor(siteUrl) {
        this.siteUrl = siteUrl
    }

    getXRequestDigest() {
        const url = new URL("_api/contextinfo", this.siteUrl);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json;odata=verbose'
            }
        }
        const xhr = new XMLHttpRequest();
        Object.entries(options.headers).map((x) => xhr.setRequestHeader(x[0], x[1]));
        xhr.open(options.method, url, false);
        return xhr.send().d.FormDigestValue;
    }

    static folderData(folderPath) {
        const fakeData = new RavencodeFolderData("1", "root", "folder", "");
        fakeData.addChild(new RavencodeFolderData("2", "empty folder", "folder", ""));

        const srcFolder = new RavencodeFolderData("3", "src folder", "folder", "");
        srcFolder.addChild(new RavencodeFolderData("4", "rokr.txt", "file", ""));
        srcFolder.addChild(new RavencodeFolderData("6", "babel.txt", "file", ""));
        fakeData.addChild(srcFolder);
        fakeData.addChild("5", "index.html", "file", "");

        return [fakeData];
    }
}

