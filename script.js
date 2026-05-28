
// ======================
// INIT
// ======================
window.onload = function () {
    loadGallery();
};

// ======================
// UPLOAD IMGBB
// ======================
async function uploadImage() {

    const input = document.getElementById("file");

    if (!input.files.length) {
        alert("Selecione uma imagem");
        return;
    }

    const file = input.files[0];

    document.getElementById("msg").innerText = "Enviando...";

    const formData = new FormData();
    formData.append("image", file);

    try {

        const apiKey = "4ec4f650a2cf5d5bb8b35cf85edc9941";

        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            { method: "POST", body: formData }
        );

        const data = await response.json();

        if (data.success) {

            const url = data.data.url;

            saveImage(url);
            addToGallery(url);

            document.getElementById("msg").innerText = "✔ Foto enviada com sucesso!";
        } else {
            document.getElementById("msg").innerText = "Erro no upload";
        }

    } catch (err) {
        document.getElementById("msg").innerText = "Erro de conexão";
    }
}

// ======================
// SALVAR LOCAL
// ======================
function saveImage(url) {
    let images = JSON.parse(localStorage.getItem("gallery")) || [];
    images.push(url);
    localStorage.setItem("gallery", JSON.stringify(images));
}

// ======================
// CARREGAR GALERIA
// ======================
function loadGallery() {
    let images = JSON.parse(localStorage.getItem("gallery")) || [];

    const div = document.getElementById("gallery");
    div.innerHTML = "";

    images.forEach(url => addToGallery(url));
}

// ======================
// EXIBIR IMAGEM
// ======================
function addToGallery(url) {
    const div = document.getElementById("gallery");

    const img = document.createElement("img");
    img.src = url;

    div.appendChild(img);
}

// ======================
// LIMPAR GALERIA
// ======================
function clearGallery() {

    localStorage.removeItem("gallery");

    const div = document.getElementById("gallery");
    div.innerHTML = "";

    document.getElementById("msg").innerText = "✔ Galeria limpa!";
}

// ======================
// DOWNLOAD (urls.txt)
// ======================
function downloadAll() {

    let images = JSON.parse(localStorage.getItem("gallery")) || [];

    let content = images.join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "urls.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    localStorage.removeItem("gallery");
    document.getElementById("gallery").innerHTML = "";

    alert("Enviado para o sistema!");
}

// ======================
// ADMIN
// ======================
function openAdmin() {

    const params = new URLSearchParams(window.location.search);
    const isAdmin = params.get("admin");

    // se não tiver URL secreta, não faz nada
    if (isAdmin !== "true") {
        return;
    }

    const user = prompt("Login:");
    const pass = prompt("Senha:");

    if (user === "admin" && pass === "admin") {

        document.getElementById("clearBtn").style.display = "inline-block";
        document.getElementById("downloadBtn").style.display = "inline-block";

        alert("Modo admin ativado");

    } else {
        alert("Acesso negado");
    }
}
