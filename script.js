// ======================
// SUPABASE
// ======================

// CERTIFIQUE-SE DE QUE ESTÁ EXATAMENTE ASSIM, EM UMA LINHA SÓ:
const supabaseUrl = "https://scwznirvzwrphztvopbz.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjd3puaXJ2endycGh6dHZvcGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzI2NzQsImV4cCI6MjA5NTY0ODY3NH0.PLvr547bIEJwjECKxQaoR7lpazs8GbSpLYLMDiGD4Po";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ======================
// INIT
// ======================

window.onload = function () {
    checkAdmin();
    loadGallery();
};

// ======================
// ADMIN
// ======================

function checkAdmin() {
    const url = new URL(window.location.href);
    const isAdmin = url.searchParams.get("admin");

    if (isAdmin !== "true") return;

    const user = prompt("Login:");
    const pass = prompt("Senha:");

    if (user === "admin" && pass === "admin") {
        document.getElementById("clearBtn").style.display = "block";
        document.getElementById("downloadBtn").style.display = "block";
        document.getElementById("gallery").style.display = "grid";
    } else {
        alert("Acesso negado");
    }
}

// ======================
// UPLOAD
// ======================

async function uploadImage() {
    const input = document.getElementById("file");

    if (!input.files.length) {
        alert("Selecione uma foto");
        return;
    }

    const file = input.files[0];
    document.getElementById("msg").innerText = "Enviando foto...";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const apiKey = "4ec4f650a2cf5d5bb8b35cf85edc9941";
        const response = await fetch(
            `https://imgbb.com{apiKey}`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.success) {
            const imageUrl = data.data.url;

            // ALTERADO: Usando 'supabaseClient'
            await supabaseClient
                .from("photos")
                .insert([{ url: imageUrl }]);

            addToGallery(imageUrl);
            document.getElementById("msg").innerText = "💖 Foto enviada com sucesso!";
        } else {
            document.getElementById("msg").innerText = "Erro no upload";
        }

    } catch (error) {
        document.getElementById("msg").innerText = "Erro de conexão";
        console.log(error);
    }
}

// ======================
// CARREGAR GALERIA
// ======================

async function loadGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    // ALTERADO: Usando 'supabaseClient'
    const { data, error } = await supabaseClient
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
    const gallery = document.getElementById("gallery");
    const img = document.createElement("img");
    img.src = url;
    gallery.appendChild(img);
}

// ======================
// LIMPAR GALERIA
// ======================

async function clearGallery() {
    // ALTERADO: Usando 'supabaseClient'
    await supabaseClient
        .from("photos")
        .delete()
        .neq("id", 0);

    document.getElementById("gallery").innerHTML = "";
    document.getElementById("msg").innerText = "Galeria limpa!";
}

// ======================
// DOWNLOAD TODAS
// ======================

async function downloadAll() {
    // ALTERADO: Usando 'supabaseClient'
    const { data, error } = await supabaseClient
        .from("photos")
        .select("*");

    if (!data.length) {
        alert("Nenhuma foto encontrada");
        return;
    }

    const urls = data.map(photo => photo.url);
    const content = urls.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "urls.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("Download iniciado!");
}
