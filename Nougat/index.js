import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0';

const demosSection = document.getElementById("demos");
const output = document.getElementById("output");

let pipe;

// 初始化模型
const init = async () => {
    pipe = await pipeline('image-to-text', 'Xenova/nougat-small');
    demosSection.classList.remove("invisible"); // 显示
};
init();

// 图片元素
const imageDisplay = document.getElementById('imageDisplay');

// 图片上传
document.getElementById('imageInput').addEventListener('change', async function (event) {
    output.innerHTML = "";
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

    console.log("==> run");

    // 隐藏
    demosSection.classList.add("invisible");
    output.innerHTML = "";

    if (!pipe) {
        alert("Model is still loading. Please try again.");
        return;
    }
    
    console.time("计算时间");

    // Generate markdown
    let url = imageDisplay.src;
    let result = await pipe(url, {
        min_length: 1,
        max_new_tokens: 40,
        bad_words_ids: [[pipe.tokenizer.unk_token_id]],
    });
    // [{ generated_text: "# Nougat: Neural Optical Understanding for Academic Documents\n\nLukas Blecher\n\nCorrespondence to: lblecher@meta.com\n\nGuillem Cucur" }]

    console.timeEnd("计算时间");

    console.log(result);
    output.innerHTML = marked.parse(result[0].generated_text);

    // 显示
    demosSection.classList.remove("invisible");
}