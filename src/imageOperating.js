import 'babel-polyfill'
import Jimp from 'jimp'
import { dragClass, dragDone } from './dragDom'
import { addVersion, redo, undo, restartVCS } from './versionControl'

async function main() {
    // 全局变量    
    const imgDom = document.getElementById("myImage")
    let originSrc = imgDom.src
    let jimpStepBegin = await Jimp.read(originSrc)
    let currentJmage = jimpStepBegin.clone()

    // 版本控制
    const undobtn = document.getElementById("undobtn")
    const redobtn = document.getElementById("redobtn")
    const restartbtn = document.getElementById("restartbtn")
    const finishbtn = document.getElementById("finishbtn")
    redobtn.onclick = function () { redo(fill) }
    undobtn.onclick = function () { undo(fill) }
    restartbtn.onclick = startOver
    finishbtn.onclick = finishStep

    // 导入导出
    const readbtn=document.getElementById("readbtn")
    const savebtn=document.getElementById("savebtn")
    readbtn.onchange=readPic
    savebtn.onclick=savePic


    //tabBar 
    const tabCrop = document.getElementById("tabCrop")
    const tabPaste = document.getElementById("tabPaste")
    const tabColor = document.getElementById("tabColor")
    const tabRotate = document.getElementById("tabRotate")
    const tabScale = document.getElementById("tabScale")
    const textbtn = document.getElementById("textbtn")
    const cropUnit = document.getElementById("cropUnit")
    const pasteUnit = document.getElementById("pasteUnit")
    const colorUnit = document.getElementById("colorUnit")
    const rotateUnit = document.getElementById("rotateUnit")
    const scaleUnit = document.getElementById("scaleUnit")
    const textUnit = document.getElementById("textUnit")
    let tab = [[tabCrop,cropUnit],[textbtn, textUnit],[tabPaste, pasteUnit],[tabColor, colorUnit],  [tabRotate, rotateUnit], [tabScale, scaleUnit]]
    for (let i = 0; i < tab.length; i++) {
        let tabHead = tab[i][0]
        tabHead.onclick = async function () {
            finishbtn.style.display = "flex"
            currentJmage=jimpStepBegin.clone()
            let src= await currentJmage.getBase64Async(Jimp.MIME_JPEG)
            putOnDom(src,imgDom)
            for (let j = 0; j < tab.length; j++) {
                if (j == i) tab[j][1].style.display = "flex"
                else tab[j][1].style.display = "none"
            }
            let list=divBox.childNodes
            for (let i = 0; i < list.length;) {
                let node =list[i]
                if (node.id == 'shawText' || node.id == 'shawImg')
                    divBox.removeChild(node)
                else i++
            }
            if(outerDiv.parentElement==divBox){
                divBox.removeChild(outerDiv)
            }

        }
    }


    // 裁剪
    let outerDiv=document.createElement('div')
    let innerDiv=document.createElement('div')
    const cutbtn=document.getElementById('cut')
    cutbtn.onclick=crop
    tabCrop.addEventListener('click',function(){
        let dc = new dragClass()
        outerDiv.style.position='absolute'
        innerDiv.style.position='absolute'
        outerDiv.style.width=divBox.clientWidth+'px'
        innerDiv.style.width=divBox.clientWidth/2+'px'
        outerDiv.style.height=divBox.clientHeight+'px'
        innerDiv.style.height=divBox.clientHeight/2+'px'
        outerDiv.style.left=innerDiv.style.left=0;
        outerDiv.style.top=innerDiv.style.top=0;
        outerDiv.style.backgroundColor="rgba(0,0,0,0)"
        innerDiv.style.backgroundColor="rgba(90,90,90,0.5)"
        dc.dragable(outerDiv,innerDiv)
        divBox.appendChild(outerDiv)
    })
    // 旋转和镜像
    const rightbtn = document.getElementById("rightbtn")
    const leftbtn = document.getElementById("leftbtn")
    const flipbtn = document.getElementById("flipbtn")
    rightbtn.onclick = rotateRight
    leftbtn.onclick = rotateLeft
    flipbtn.onclick = mirror

    // 颜色与缩放
    const blurSlider = document.getElementById("blur")
    const brightSlider = document.getElementById("bright")
    const contrastSlider = document.getElementById("contrast")
    const scaleSlider = document.getElementById("scale")
    blurSlider.onchange = blur
    brightSlider.onchange = adjustBrightness
    contrastSlider.onchange = adjustContrast
    scaleSlider.onchange = scale

    // 插入文字
    let font = await Jimp.loadFont("/fonts/open-sans/open-sans-32-white/open-sans-32-white.fnt")
    textbtn.addEventListener('click', function () {
        addTextInput()
        for (let j = 0; j < tab.length; j++) {
            tab[j][1].style.display = "none"
        }
        finishbtn.style.display = "flex"
    })

    // 粘贴表情
    const divBox = document.getElementById("dragBox")
    let faceList = document.getElementById("pasteUnit").childNodes
    for (const node of faceList) {
        if(node.localName=='img'){
            node.style.border="1px solid grey"
            node.onclick=function(){
                node.id='shawImg'
                let dc = new dragClass()
                dc.dragable(divBox, node)
            }
        }
    }



    async function crop() {
        let x=parseInt(innerDiv.style.left)
        let y=parseInt(innerDiv.style.top)
        let w=parseInt(innerDiv.style.width)
        let h=parseInt(innerDiv.style.height)
        currentJmage.crop(x,y,w,h)
        divBox.removeChild(outerDiv)
        let src = await currentJmage.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    function addTextInput() {
        let textInput = document.createElement('input')
        textInput.id = "shawText"
        textInput.type = 'text'
        textInput.value = ''
        textInput.placeholder = 'enter a English word'
        let dc = new dragClass()
        dc.dragable(divBox, textInput)
    }
   
    function fill(url) {
        imgDom.onload = function () { }
        imgDom.src = url

    }

    async function rotateRight() {

        currentJmage.rotate(-90).autocrop()
        let src = await currentJmage.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    async function rotateLeft() {
        currentJmage.rotate(90).autocrop()
        let src = await currentJmage.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    async function blur() {
        let blurValue = parseInt(blurSlider.value)
        let jim = jimpStepBegin.clone()
        if (blurValue > 0) jim.blur(blurValue)
        let src = await jim.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    async function scale() {
        let scaleValue = parseFloat(scaleSlider.value)
        let jim = jimpStepBegin.clone()
        jim.scale(scaleValue)
        let src = await jim.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    async function adjustBrightness() {
        let brightnessValue = parseFloat(brightSlider.value)
        let jim = jimpStepBegin.clone()
        jim.brightness(brightnessValue)
        let src = await jim.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    async function adjustContrast() {
        let contrastValue = parseFloat(contrastSlider.value)
        let jim = jimpStepBegin.clone()
        jim.contrast(contrastValue)
        let src = await jim.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }
    async function mirror() {
        currentJmage.mirror(true, false)
        let src = await currentJmage.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
    }

    async function startOver() {
        blurSlider.value = 0
        contrastSlider.value = 0
        brightSlider.value = 0
        scaleSlider.value = 1
        let jmage = await Jimp.read(originSrc)
        currentJmage = jmage.clone()
        let src = await jmage.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
        restartVCS()
        addVersion(src)
    }
    function startOnNewImg() {
        blurSlider.value = 0
        contrastSlider.value = 0
        brightSlider.value = 0
        scaleSlider.value = 1
        for (let j = 0; j < tab.length; j++) {
            tab[j][1].style.display = "none"
        }
        finishbtn.style.display = "none"
    }
    async function finishStep() {
        currentJmage = await Jimp.read(imgDom.src)

        let list = divBox.childNodes
        console.log(list)
        for (const node of list) {
            if (node.id == 'shawText') {
                currentJmage.print(font, parseInt(node.offsetLeft), parseInt(node.offsetTop), node.value)
            }
            if (node.id == 'shawImg') {
                let pmage = await Jimp.read(node.src)
                pmage.resize(parseInt(node.style.width),parseInt(node.style.height))
                currentJmage.composite(pmage, parseInt(node.style.left), parseInt(node.style.top))
            }
        }
        for (let i = 0; i < list.length;) {
            let node =list[i]
            if (node.id == 'shawText' || node.id == 'shawImg')
                divBox.removeChild(node)
            else i++
        }
        console.log(list)
        jimpStepBegin = currentJmage.clone()
        let src = await jimpStepBegin.getBase64Async(Jimp.MIME_JPEG)
        putOnDom(src, imgDom)
        addVersion(src)
        startOnNewImg()
    }
    async function putOnDom(src, imgDom) {
        // imgDom.onload = function () {
        //     ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        //     ctx.drawImage(imgDom, 0, 0)
        // }
        imgDom.src = src;
    }
    function readPic() {
        let file = document.getElementById("readbtn").files[0];
        let reader = new FileReader();
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);
        reader.onload = async function(e) {
          let src = e.target.result;
          originSrc=src
          jimpStepBegin = await Jimp.read(src)
          currentJmage=jimpStepBegin.clone()
          putOnDom(src,imgDom)
          startOver()
        };
      }
      function dataURLtoBlob(dataurl) {
        // dataurl
        let arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }
      function savePic () {
        let content = dataURLtoBlob(imgDom.src);
        let urlObject = window.URL || window.webkitURL || window;
        let url = urlObject.createObjectURL(content);
        //生成<a></a>DOM元素
        let el = document.createElement("a");
        //链接赋值
        el.href = url;
        el.download = "新图片";
        //必须点击否则不会下载
        el.click();
        //移除链接释放资源
        urlObject.revokeObjectURL(url);
      }

    startOver()
}
main()