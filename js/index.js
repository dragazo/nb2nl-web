// import("../pkg/index.js").catch(console.error);
let nb2nl;
import("../pkg/index.js").then(res => nb2nl = res);

// source: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function compileXml(proj_name, content) {
    try {
        return nb2nl.parse_xml(proj_name, content);
    }
    catch (err) {
        alert(`failed to compile: ${err}`);
    }
}
function compileNl(proj_name, content) {
    try {
        return nb2nl.parse_nl(proj_name, content);
    }
    catch (err) {
        alert(`failed to compile: ${err}`);
    }
}

function processFile(file) {
    let parser = undefined;
    let proj_name = undefined;
    if (file.name.endsWith('.xml')) {
        parser = compileXml;
        proj_name = file.name.slice(0, -4);
    }
    else if (file.name.endsWith('.nlogo')) {
        parser = compileNl;
        proj_name = file.name.slice(0, -6);
    }
    else {
        alert('unknown file type');
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        const res = parser(proj_name, e.target.result);
        if (res === undefined) return;
        download('netlogo.txt', res);
    };
    reader.readAsText(file);
}
function processDrop(e) {
    const files = [];
    if (e.dataTransfer.items) {
        for (const item of e.dataTransfer.items) {
            if (item.kind === 'file') files.push(item.getAsFile());
        }
    } else {
        for (const file of e.dataTransfer.files) {
            files.push(file);
        }
    }
    if (files.length !== 1) { alert('expected exactly 1 file'); return; }
    processFile(files[0]);
}

window.addEventListener('load', () => {
    const drop = document.getElementById('drop');
    const dropWrapper = document.getElementById('drop-wrapper');

    const dragStart = () => {
        drop.classList.add('drag-hover');
        dropWrapper.classList.add('drag-hover');
    };
    const dragStop = () => {
        drop.classList.remove('drag-hover');
        dropWrapper.classList.remove('drag-hover');
    };

    drop.addEventListener('dragover', e => e.preventDefault());
    drop.addEventListener('dragenter', dragStart);
    drop.addEventListener('dragleave', dragStop);
    drop.addEventListener('drop', e => {
        e.preventDefault();
        dragStop();
        processDrop(e);
    });
});
