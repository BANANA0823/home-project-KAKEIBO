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
document.getElementById("item").value = "";
document.getElementById("price").value = "";

localStorage.setItem(
    "kakeibo",
    document.getElementById("list").innerHTML
);
updateTotal();
}
function updateTotal() {
    let total = 0;

    document.querySelectorAll("#list li").forEach(li => {
        const text = li.innerText;
        const match = text.match(/¥([\d,]+)/);

        if (match) {
            total += Number(match[1].replace(/,/g, ""));
        }
    });

    document.getElementById("total").textContent =
        "¥" + total.toLocaleString();
}
