window.onload = function () {
    const saved = localStorage.getItem("kakeibo");

    if (saved) {
        document.getElementById("list").innerHTML = saved;
    }
};
function add() {

    const date = document.getElementById("date").value;
    const item = document.getElementById("item").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;

    if (!date || !item || !price) {
        alert("全部入力してください！");
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
<b>${item}</b><br>
${category}<br>
¥${Number(price).toLocaleString()}<br>
${date}
`;

    document.getElementById("list").appendChild(li);

    document.getElementById("item").value = "";
    document.getElementById("price").value = "";
}
