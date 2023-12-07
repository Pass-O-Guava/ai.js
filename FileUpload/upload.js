document.getElementById("fileInput").addEventListener("change", uploadFile);

function uploadFile(evnent) {
    var file = evnent.target.files[0];

    output = '文件名: ' + file.name + '\n' + '文件类型: ' + file.type + '\n' + '文件大小: ' + file.size + ' bytes';
    document.getElementById("output").innerText = output;
    
    var previewArea = document.getElementById('filePreview');
    var reader = new FileReader();

    reader.onload = function(e) {
        var fileUrl = e.target.result;
        if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
            previewArea.innerHTML = generatePreviewHTML(file, fileUrl);
        } else {
            // 对于文本文件，直接显示内容
            previewArea.innerHTML = '<pre>' + e.target.result + '</pre>';
        }
    };

    if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
    } else {
        // 读取文本文件内容
        reader.readAsText(file);
    }
}

function generatePreviewHTML(file, fileUrl) {
    var fileType = file.type;
    var html = '';

    if (fileType.startsWith('image/')) {
        html = '<img src="' + fileUrl + '" alt="Image preview" style="max-width: 500px;">';
    } else if (fileType.startsWith('audio/')) {
        html = '<audio controls src="' + fileUrl + '"></audio>';
    } else if (fileType.startsWith('video/')) {
        html = '<video controls src="' + fileUrl + '" style="max-width: 500px;"></video>';
    } else if (fileType === 'application/pdf') {
        html = '<iframe src="' + fileUrl + '" style="width: 500px; height: 500px;"></iframe>';
    }

    return html;
}
