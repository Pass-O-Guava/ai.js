// ——————————————————————————
// 实现麦克风音频流和摄像头视频流的加载和展示可以通过 HTML5 和 JavaScript 的 getUserMedia() 接口来完成。
// 这个接口允许你访问用户的麦克风和摄像头，并在网页上显示音频和视频流。
// ——————————————————————————

document.getElementById('startAudio').addEventListener('click', function() {

    // 对于音频，我们设置 { audio: true, video: false } 以只请求麦克风
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            var audioOutput = document.getElementById('audioOutput');
            // 成功获取流之后，这些流被设置为对应 <audio> 或 <video> 元素的 srcObject 属性，并显示这些元素
            audioOutput.srcObject = stream;
            audioOutput.style.display = 'block';
        })
        .catch(function(err) {
            console.error('音频流获取失败：', err);
        });
});

document.getElementById('startVideo').addEventListener('click', function() {

    // 对于视频，我们设置 { audio: false, video: true } 以只请求摄像头
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(function(stream) {
            var videoOutput = document.getElementById('videoOutput');
            // 成功获取流之后，这些流被设置为对应 <audio> 或 <video> 元素的 srcObject 属性，并显示这些元素
            videoOutput.srcObject = stream;
            videoOutput.style.display = 'block';
        })
        .catch(function(err) {
            console.error('视频流获取失败：', err);
        });
});
