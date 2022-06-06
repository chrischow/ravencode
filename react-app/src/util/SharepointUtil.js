import $ from 'jquery';

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
    
    /**
     * FOLDER --
     * _api/web/folders
     * d.results[].__metadata.uri /_api/web/GetFolderByServerRelativeUrl('')
     * d.results[].__metadata.type = SP.Folder or SP.File
     * d.results[].Name
     * d.results[].ServerRelativeUrl /xxx/xxx
     * d.results[].ItemCount 0 means empty folder
     * 
     * FILE --
     * _api/web/files
     * d.results[].__metadata.uri /_api/web/GetFileByServerRelativeUrl('')
     * d.results[].__metadata.type = SP.Folder or SP.File
     * d.results[].Name
     * d.results[].ServerRelativeUrl /xxx/xxx/xxx.xxx
     * 
     * FILE Data--
     * headers "X-FORMS_BASE_AUTH_ACCEPTED", "f"
     * text returned. responseText
     * _api/web/GetFileByServerRelativeUrl('')/$value
     */
    getSPFolders(callback) {
        const reqDigest = $.ajax({
            url: new URL("_api/web/folders", this.siteUrl),
            method: 'GET',
            async: true,
            headers: {
                'Accept': 'application/json;odata=verbose'
            },
            success: data => callback(data),
            error: (err) => console.log(JSON.stringify(err))
        })
    }

    getXRequestDigest() {
        const reqDigest = $.ajax({
            url: new URL("_api/contextinfo", this.siteUrl),
            method: 'POST',
            async: false,
            headers: {
                'Accept': 'application/json;odata=verbose'
            },
            success: data => data,
            error: (err) => console.log(JSON.stringify(err))
        })
        return reqDigest.responseJSON.d.GetContextWebInformation.FormDigestValue;
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

