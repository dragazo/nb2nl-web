// import("../pkg/index.js").catch(console.error);
let nb2nl;
import("../pkg/index.js").then(res => nb2nl = res);

function compile() {
    if (!nb2nl) return;
    const xml = $('#xml-content').val();
    try {
        const res = nb2nl.parse_xml(xml);
        $('#netlogo-out').val(res);
    }
    catch (err) {
        alert(`failed to compile: ${err}`);
    }
}

window.addEventListener('load', () => {
    $('#compile-btn').click(compile);
    console.log('setup complete');
});