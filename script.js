```js id="n6xvtc"
// ======================
// SUPABASE
// ======================

const supabaseUrl =
"https://scwznirvzwrphztvopbz.supabase.co/rest/v1/";

const supabaseKey =
"sb_publishable_QH-jIG52Qp6BC6pG5t_mHQ_YuNmM5Ly";

const supabase =
window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ======================
// INIT
// ======================

window.onload = function () {

    loadGallery();

    checkAdmin();
};

// ======================
// ADMIN
// ======================

function checkAdmin() {

    const url =
    new URL(window.location.href);

    const isAdmin =
    url.searchParams.get("admin");

    if (isAdmin !== "true") return;

    const user =
    prompt("Login:");

    const pass =
    prompt("Senha:");

    if (
        user === "admin" &&
        pass === "admin"
    ) {

        document.getElementById(
            "clearBtn"
        ).style.display = "block";

        document.getElementById(
            "downloadBtn"
        ).style.display = "block";

        document.getElementById(
            "gallery"
        ).style.display = "grid";

    } else {

        alert("Acesso negado");

    }
}

// ======================
// UPLOAD
// ======================

async function uploadImage() {

    const input =
    document.getElementById("file");

    if (!input.files.length) {

        alert("Selecione uma foto");

        return;
    }

    const file =
    input.files[0];

    document.getElementById("msg").innerText =
    "Enviando foto...";

    const formData =
    new FormData();

    formData.append("image", file);

    try {

        const apiKey =
        "4ec4f650a2cf5d5bb8b35cf85edc9941";

        const response =
        await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData
            }
        );

        const data =
        await response.json();

        if (data.success) {

            const imageUrl =
            data.data.url;

            // SALVA ONLINE
            await supabase
                .from("photos")
                .insert([
                    {
                        url: imageUrl
                    }
                ]);

            addToGallery(imageUrl);

            document.getElementById("msg").innerText =
            "💖 Foto enviada com sucesso!";

        } else {

            document.getElementById("msg").innerText =
            "Erro no upload";

        }

    } catch (error) {

        document.getElementById("msg").innerText =
        "Erro de conexão";

        console.log(error);
    }
}

// ======================
// CARREGAR GALERIA
// ======================

async function loadGallery() {

    const gallery =
    document.getElementById("gallery");

    gallery.innerHTML = "";

    const {
        data,
        error
    } = await supabase
        .from("photos")
        .select("*");

    if (error) {

        console.log(error);

        return;
    }

    data.forEach(photo => {

        addToGallery(photo.url);

    });
}

// ======================
// EXIBIR FOTO
// ======================

function addToGallery(url) {

    const gallery =
    document.getElementById("gallery");

    const img =
    document.createElement("img");

    img.src = url;

    gallery.appendChild(img);
}

// ======================
// LIMPAR GALERIA
// ======================

async function clearGallery() {

    await supabase
        .from("photos")
        .delete()
        .neq("id", 0);

    document.getElementById(
        "gallery"
    ).innerHTML = "";

    document.getElementById(
        "msg"
    ).innerText =
    "Galeria limpa!";
}

// ======================
// DOWNLOAD TODAS
// ======================

async function downloadAll() {

    const {
        data,
        error
    } = await supabase
        .from("photos")
        .select("*");

    if (!data.length) {

        alert("Nenhuma foto encontrada");

        return;
    }

    const urls =
    data.map(photo => photo.url);

    const content =
    urls.join("\n");

    const blob =
    new Blob(
        [content],
        {
            type: "text/plain"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "urls.txt";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    alert("Download iniciado!");
}
