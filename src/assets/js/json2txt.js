function json2txt(urls,file) {
    var text = "";
    $.each(urls, function(index, val) {
        if (val["Url"] && val["Products"]){
            text += val["Url"] + "\t" + val["Products"] + " \r\n";
        }
        else if (val["Url"] && !val["Products"]) {
            text += val["Url"] + " \r\n";
        }
        else if (!val["Url"] && val["Products"]) {
            text += val["Products"] + " \r\n";
        }
    });
    // 下载文件方法
    var funDownload = function (content, filename) {
        let link = document.createElement("a");
        link.setAttribute("download", filename);
        link.style.display = 'none';
        document.body.appendChild(link);
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
        link.href = URL.createObjectURL(blob);
        // 触发点击
        link.click();
        // 然后移除
        document.body.removeChild(link);
    };
    if ('download' in document.createElement('a')) {
            funDownload(text, file);    
    } else {
            goby.showErrorMessage('浏览器不支持');    
    }
}