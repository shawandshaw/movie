import 'babel-polyfill'

function dragClass() {
    this.dragFlag = false;
    this.x = 0
    this.y = 0
    let outer = this
    this.dragable = function (dragBox, dragItem) {
        let dragChild = dragItem.cloneNode()
        dragChild.style.position = 'absolute'
        dragChild.style.left = 0
        dragChild.style.top = 0
        dragBox.appendChild(dragChild)
        dragChild.onmousedown = function (e) {
            e = e || window.event;
            outer.x = e.clientX - dragChild.offsetLeft;
            outer.y = e.clientY - dragChild.offsetTop;
            outer.dragFlag = true;
        };
        dragChild.onmouseup = function (e) {
            outer.dragFlag = false;
        };
        dragBox.onmouseup = function (e) {
            outer.dragFlag = false;
        };
        dragBox.onmouseleave = function (e) {
            outer.dragFlag = false;
        };

        dragBox.addEventListener('mousemove', function (e) {
            if (outer.dragFlag) {
                e = e || window.event;
                let offsetX = e.clientX - outer.x
                let offsetY = e.clientY - outer.y
                if (offsetX < 0) offsetX = 0
                if (offsetY < 0) offsetY = 0
                if (offsetX > dragBox.clientWidth - dragChild.offsetWidth) offsetX = dragBox.clientWidth - dragChild.offsetWidth
                if (offsetY > dragBox.clientHeight - dragChild.offsetHeight) offsetY = dragBox.clientHeight - dragChild.offsetHeight
                dragChild.style.left = offsetX + "px";
                dragChild.style.top = offsetY + "px";
            }
        })
        return dragChild
    }
}

function dragDone(dragBox, dragItem) {
    dragBox.removeChild(dragItem)
}
export {
    dragClass,
    dragDone
}