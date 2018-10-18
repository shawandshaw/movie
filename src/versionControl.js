import 'babel-polyfill'
let operatingHistory = {
    history: [],
    version: -1,
    lastVersion: 0
}

function addVersion(url) {
    // 若后面有旧版本则覆盖
    operatingHistory.history.splice(
        operatingHistory.version + 1,
        operatingHistory.lastVersion - operatingHistory.version
    );
    operatingHistory.history.push(url);
    ++operatingHistory.version;
    operatingHistory.lastVersion = operatingHistory.version;
    console.log('addVersion', operatingHistory.version, operatingHistory.lastVersion)
}
async function undo(func) {
    if (operatingHistory.version - 1 >= 0) {
        func(
            operatingHistory.history[--operatingHistory.version]
        );
    }
    console.log('undo', operatingHistory.version, operatingHistory.lastVersion)
}
async function redo(func) {
    if (
        operatingHistory.version + 1 <=
        operatingHistory.lastVersion
    ) {
        func(
            operatingHistory.history[++operatingHistory.version]
        );
    }
    console.log('redo', operatingHistory.version, operatingHistory.lastVersion)
}
function restartVCS() {
    operatingHistory.history.splice(
        0,
        operatingHistory.history.length
    );
    operatingHistory.version = -1;
}
export {addVersion,redo,undo,restartVCS}