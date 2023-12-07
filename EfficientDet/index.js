import { ObjectDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

const demosSection = document.getElementById("demos");
let objectDetector;
let runningMode = "IMAGE";

// 图片元素
const imageDisplay = document.getElementById('imageDisplay');

// 图片bbox清除
function clean_drew(target) {
    const highlighters = target.parentNode.getElementsByClassName("highlighter");
    while (highlighters[0]) {
        highlighters[0].parentNode.removeChild(highlighters[0]);
    }
    const infos = target.parentNode.getElementsByClassName("info");
    while (infos[0]) {
        infos[0].parentNode.removeChild(infos[0]);
    }
}

// 图片上传
document.getElementById('imageInput').addEventListener('change', async function(event) {

    clean_drew(imageDisplay);

    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            
            imageDisplay.src = e.target.result;
            imageDisplay.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// 初始化模型
const initializeObjectDetector = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm");
    objectDetector = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite`,
            delegate: "GPU"
        },
        scoreThreshold: 0.5,
        runningMode: runningMode
    });
    demosSection.classList.remove("invisible");
};
initializeObjectDetector();

// 图片点击事件
document.getElementById("imageDisplay").addEventListener("click", handleClick);

// 异步推理
async function handleClick() {

    clean_drew(imageDisplay);

    if (!objectDetector) {
        alert("Object Detector is still loading. Please try again.");
        return;
    }
    // if video mode is initialized, set runningMode to image
    if (runningMode === "VIDEO") {
        runningMode = "IMAGE";
        await objectDetector.setOptions({ runningMode: "IMAGE" });
    }
    const detections = objectDetector.detect(imageDisplay);
    displayImageDetections(detections, imageDisplay);
}

// 绘图
function displayImageDetections(result, resultElement) {
    const ratio = resultElement.height / resultElement.naturalHeight;
    for (let detection of result.detections) {

        // Description text
        const p = document.createElement("p");
        p.setAttribute("class", "info");
        p.innerText =
            detection.categories[0].categoryName +
                " - with " +
                Math.round(parseFloat(detection.categories[0].score) * 100) +
                "% confidence.";
        p.style =
            "left: " +
                detection.boundingBox.originX * ratio +
                "px;" +
                "top: " +
                detection.boundingBox.originY * ratio +
                "px; " +
                "width: " +
                (detection.boundingBox.width * ratio - 10) +
                "px;";

        // BoundingBox
        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style =
            "left: " +
                detection.boundingBox.originX * ratio +
                "px;" +
                "top: " +
                detection.boundingBox.originY * ratio +
                "px;" +
                "width: " +
                detection.boundingBox.width * ratio +
                "px;" +
                "height: " +
                detection.boundingBox.height * ratio +
                "px;";

        resultElement.parentNode.appendChild(highlighter);
        resultElement.parentNode.appendChild(p);
    }
}