function findReplaceMissingItems (templateFolder) {

    function getItemsRecursive(items) {
        var result = [];
        for (var i = 1; i < items.length; i++) {
            var item = items[i];
            if (item instanceof FootageItem) {
                result.push(item);
            } else if (item instanceof FolderItem) {
                result = result.concat(getItemsRecursive(item.items));
            }
        }
        return result;
    }

    function getFilesRecursive(folder) {
        var files = folder.getFiles();
        var result = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file instanceof File) {
                result.push(file);
            } else if (file instanceof Folder) {
                result = result.concat(getFilesRecursive(file));
            }
        }
        return result;
    }

    var items = getItemsRecursive(app.project.items);
    var files = getFilesRecursive(Folder(templateFolder));

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        gAECommandLineRenderer.log_file
            .writeln("ITEM --> "+ item.name +" ["+ item.toString() +"]");
        
        if (item.footageMissing == true) {
            // find missing items in files and replace
            for (var j = 0; j < files.length; j++) {
                var file = files[j];
                
                if (file.fsName.replace(/%20/g, " " ).indexOf(item.name.replace(/%20/g, " ")) != -1) {
                    
                    gAECommandLineRenderer.log_file
                        .writeln("REPLACE --> "+ item.name +" WITH "+ file.fsName);
                    
                    item.replace(file);
                }
            }
        }
    }
}


app.beginUndoGroup("Replacing");
findReplaceMissingItems("C:/my-ae-files/tempalte-1");
app.endUndoGroup();
