import { AssessmentRounded } from '@mui/icons-material';
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
    
    concatChildren(children) {
        this.children = this.children.concat(children);
    }

    addChild(child) {
        this.children.push(child);
    }
}

export class SharepointUtil{
    constructor(siteUrl) {
        if (siteUrl) {
            this.setSiteUrl(siteUrl);
        } else {
            this.siteUrl = "";
        }
    }
    
    setSiteUrl(siteUrl) {
        /\/$/.test(siteUrl) 
            ? this.siteUrl = siteUrl
            : this.siteUrl = siteUrl + "/";
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
    async getTextFileData(relativeUrl) {
        var request;
        try {
        request = await fetch(new URL(`_api/web/GetFileByServerRelativeUrl('${relativeUrl}')/$value`, 
            this.siteUrl),
            {
                method: 'GET',
            });
        } catch(err) {
            console.error(err);
        }
        return request.text();
    }

    async updateTextFile(relativeUrl, data) {
        var request;
        try{
            request = await fetch(new URL(`_api/web/GetFileByServerRelativeUrl('${relativeUrl}')/$value`, 
            this.siteUrl),
            {
                method: 'POST',
                headers: {
                    "X-HTTP-Method": "PUT",
                    "Content-Length": data.length,
                    "X-RequestDigest": this.getXRequestDigest()
                },
                body: data
            });
        } catch(err) {
            console.error(err);
        }
        return request;
    }

    // This is a recursive function that retrieves the whole folder and file structure if nothing is passed.
    // The underlying assumption is that the root siteUrl has no files!!!
    async getFileObjFrom(relativeUrl = null, type = "folders") {
        // Folders first
        const result = [];
        try{
            const url = (relativeUrl === null
                ? new URL(`_api/web/${type}`, this.siteUrl)
                : new URL(`_api/web/GetFolderByServerRelativeUrl('${relativeUrl}')/${type}`, this.siteUrl));
            var request = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json;odata=verbose'
                    }
                });
            // console.log(url.href);
            // console.log(request.status);
            // console.log(request.ok);
            const mainJson = await request.json();
            // console.log(mainJson);
            if (Array.isArray(mainJson.d.results)) {
                await Promise.all(mainJson.d.results.map(async (node) => {
                    const data = new RavencodeFolderData(
                        node.Name, 
                        node.Name, 
                        node.__metadata.type === "SP.Folder" ? "folder" : "file",
                        node.ServerRelativeUrl);
                        if (node.__metadata.type === "SP.Folder" && node.ItemCount > 0) {
                            const childFolderData = await this.getFileObjFrom(node.ServerRelativeUrl + "/", "Folders");
                            const childFileData = await this.getFileObjFrom(node.ServerRelativeUrl + "/", "Files");
                            data.concatChildren(childFolderData.concat(childFileData));
                        }
                    result.push(data);
                }));
            }
        } catch(err) {
            console.error(err);
        }
        return result;
    }

    static folderData(folderPath) {
        const fakeData = new RavencodeFolderData("1", "root", "folder", "/root");
        fakeData.addChild(new RavencodeFolderData("2", "empty folder", "folder", "/root/empty folder"));

        const srcFolder = new RavencodeFolderData("3", "src folder", "folder", "");
        srcFolder.addChild(new RavencodeFolderData("4", "rokr.txt", "file", "/root/src/rokr.txt"));
        srcFolder.addChild(new RavencodeFolderData("6", "babel.txt", "file", "/root/src/babel.txt"));
        fakeData.addChild(srcFolder);
        fakeData.addChild(new RavencodeFolderData("5", "index.html", "file", "/root/index.html"));

        return [fakeData];
    }
}

