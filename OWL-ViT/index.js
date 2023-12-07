import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';

const demosSection = document.getElementById("demos");
let model_owl;

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

// 初始化模型
const initializeObjectDetector = async () => {
    model_owl = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');

    // 显示
    demosSection.classList.remove("invisible");
};
initializeObjectDetector();

// 图片点击事件
document.getElementById("btn_owlvit").addEventListener("click", owlvit);


// 异步推理
async function owlvit(event) {

    // 隐藏
    demosSection.classList.add("invisible");

    clean_drew(imageDisplay);

    if (!model_owl) {
        alert("Object Detector is still loading. Please try again.");
        return;
    }

    // let candidate_labels = ['woman', 'yellow dog', 'brown dog', 'black shoes', 'white shoes', 'tree']
    let candidate_labels = document.getElementById('inputText').value.split(",").map(item => item.trim());
    console.log(candidate_labels)

    const output = await model_owl(imageDisplay.src, candidate_labels);
    console.log(output)
    let topk = parseInt(document.getElementById("topk").value);
    imageDisplay.title = JSON.stringify(output.slice(0, topk), null, 2); // 第二个和第三个参数用于格式化输出

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
    let score = parseFloat(document.getElementById("score").value);
    let topk = parseInt(document.getElementById("topk").value);

    if (result.length < topk) {
        topk = result.length;
    }

    for (let i = 0; i < topk; i++) {
        if (!('score' in result[i])) {
            console.log(result[i] + "===> not score key!");
            continue;
        }
        if (result[i].score < score) { break; }

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