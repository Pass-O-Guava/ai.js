import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';

const demosSection = document.getElementById("demos");
let detector;

// 图片元素
const imageDisplay = document.getElementById('imageDisplay');

// 初始化模型
const initializeObjectDetector = async () => {
    detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');

    // 显示
    demosSection.classList.remove("invisible");
};
initializeObjectDetector();

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

document.getElementById("cls").addEventListener("click", function (e) {
    clean_drew(imageDisplay);
})

// 图片上传
document.getElementById('imageInput').addEventListener('change', async function (event) {

    clean_drew(imageDisplay);

    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {

            imageDisplay.src = e.target.result;
            imageDisplay.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});


// 图片点击事件
document.getElementById("btn_run").addEventListener("click", run);

// 异步推理
async function run(event) {

    // 隐藏
    demosSection.classList.add("invisible");

    clean_drew(imageDisplay);

    if (!detector) {
        alert("Object Detector is still loading. Please try again.");
        return;
    }

    let threshold = parseInt(document.getElementById("threshold").value);

    console.time("计算时间");

    const output = await detector(imageDisplay.src, { "threshold": threshold });
    console.log(output)

    console.timeEnd("计算时间");
    
    let topk = parseInt(document.getElementById("topk").value);
    imageDisplay.title = JSON.stringify(output.slice(0, topk), null, 2);

    if (output.length !== 0) {
        displayImageDetections_v2(output, imageDisplay);
    } 
    else { 
        alert("Detect result is NULL");
    }

    // 显示
    demosSection.classList.remove("invisible");
}

// 图片bbox绘制
function displayImageDetections_v2(result, resultElement) {

    const ratio = resultElement.height / resultElement.naturalHeight;
    let topk = parseInt(document.getElementById("topk").value);

    if (result.length < topk) {
        topk = result.length;
    }

    for (let i = 0; i < topk; i++) {

        // Description text
        const p = document.createElement("p");
        p.setAttribute("class", "info");
        p.innerText = result[i].label + ", " + Math.round(parseFloat(result[i].score) * 100) + "%";
        p.style =
            "left: " +
            result[i].box.xmin * ratio +
            "px;" +
            "top: " +
            result[i].box.ymin * ratio +
            "px; " +
            "width: " +
            ((result[i].box.xmax - result[i].box.xmin) * ratio - 10) +
            "px;";

        const highlighter = document.createElement("div");
        highlighter.setAttribute("class", "highlighter");
        highlighter.style =
            "left: " +
            result[i].box.xmin * ratio +
            "px;" +
            "top: " +
            result[i].box.ymin * ratio +
            "px;" +
            "width: " +
            (result[i].box.xmax - result[i].box.xmin) * ratio +
            "px;" +
            "height: " +
            (result[i].box.ymax - result[i].box.ymin) * ratio +
            "px;";

        resultElement.parentNode.appendChild(highlighter);
        resultElement.parentNode.appendChild(p);
    }
}