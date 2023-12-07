import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.8.0';

// 获得页面按钮
const btn = document.getElementById("btn");
// 给按钮添加事件监听、处理函数
// 注意：run是异步函数，通过 async/await，可以同步的方式编写基于异步的代码
btn.addEventListener("click", async () => {
    document.getElementById("output").innerText = "";
    const res = await run();
    document.getElementById("output").innerText = res;
})
// 定义ASR变量，用于后面pipeliine赋值
let asr;

const info = document.getElementById("info");

// 定义模型加载
async function init(){

    console.log("==> init");
    info.innerText = "模型加载中...";

    var start = new Date().getTime();

    asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
    
    var time = new Date().getTime() - start;
    console.log("==> init time: " + time + "ms");

    info.innerText = "模型加载时间：" + time + "ms";

    btn.hidden = false;
}
// 执行模型加载
init();

// 查询并获取页面audio元素的src属性
var src = document.querySelector('audio').src;
console.log("==> audio: " + src);

// 定义模型推理，由按钮事件监听触发执行
async function run(){

    console.log("==> run");
    info.innerText = "模型推理中...";

    if (!asr) {
        alert("Model is still loading. Please try again.");
        return;
    }

    btn.hidden = true;
    var start = new Date().getTime();
    
    const output = await asr(src, { language: 'french', task: 'translate'});
    
    var time = new Date().getTime() - start;
    console.log("==> run time: " + time + "ms");
    console.log(output);
    btn.hidden = false;
    
    info.innerText = "模型推理时间：" + time + "ms";
    return '"' + output.text + '"'
}


async function test(){
    const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
    const output = await transcriber('french-audio.mp3', { language: 'french', task: 'translate'});
    console.log(output);
}