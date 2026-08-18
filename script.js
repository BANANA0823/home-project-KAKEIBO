/* =========================
   🍌 ばなな家計簿
   ========================= */


/* =========================
   データ
   ========================= */

let records = [];

let combo = 0;


/* =========================
   保存データを読み込む
   ========================= */

const savedRecords =
    localStorage.getItem("bananaKakeiboRecords");


if(savedRecords){

    try{

        records = JSON.parse(savedRecords);

    }catch(error){

        records = [];

    }

}


/* =========================
   今日の日付
   ========================= */

function getToday(){

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2,"0");

    const day =
        String(
            now.getDate()
        ).padStart(2,"0");

    return `${year}-${month}-${day}`;

}


document.getElementById("date").value =
    getToday();


/* =========================
   保存
   ========================= */

function saveRecords(){

    localStorage.setItem(
        "bananaKakeiboRecords",
        JSON.stringify(records)
    );

}


/* =========================
   合計金額
   ========================= */

function getTotal(){

    return records.reduce(
        (sum,record) =>
            sum + record.price,
        0
    );

}


/* =========================
   画面更新
   ========================= */

function updateDisplay(){

    const total =
        getTotal();


    document.getElementById("total").textContent =
        "合計：" +
        total.toLocaleString() +
        "円";


    document.getElementById("count").textContent =
        "📖 記録：" +
        records.length +
        "件";


    document.getElementById("combo").textContent =
        "🔥 " +
        combo +
        " COMBO";


    renderRecords();

}


/* =========================
   記録一覧を表示
   ========================= */

function renderRecords(){

    const list =
        document.getElementById("recordList");

    const empty =
        document.getElementById("emptyMessage");


    list.innerHTML = "";


    if(records.length === 0){

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    /*
       新しい記録を上に表示
    */

    records.forEach(
        (record,index) => {

            const li =
                document.createElement("li");


            const date =
                document.createElement("div");

            date.className =
                "record-date";

            date.textContent =
                "📅 " + record.date;


            const item =
                document.createElement("div");

            item.className =
                "record-item";

            item.textContent =
                "💰 " + record.item;


            const price =
                document.createElement("div");

            price.className =
                "record-price";

            price.textContent =
                "💴 " +
                record.price.toLocaleString() +
                "円";


            /*
               削除ボタン
            */

            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "この記録を削除";


            deleteButton.onclick =
                function(){

                    deleteRecord(index);

                };


            li.appendChild(date);

            li.appendChild(item);

            li.appendChild(price);

            li.appendChild(deleteButton);

            list.appendChild(li);

        }
    );

}


/* =========================
   💰 記録追加
   ========================= */

function addRecord(){

    const date =
        document.getElementById("date").value;

    const item =
        document.getElementById("item").value;

    const price =
        Number(
            document.getElementById("price").value
        );


    /* =====================
       入力チェック
       ===================== */

    if(!date){

        alert(
            "📅 日付を選んでね🍌"
        );

        return;

    }


    if(!item){

        alert(
            "💰 何に使ったか選んでね🍌"
        );

        return;

    }


    if(!price || price <= 0){

        alert(
            "💴 金額を入力してね🍌"
        );

        return;

    }


    /* =====================
       記録を作る
       ===================== */

    const newRecord = {

        date:date,

        item:item,

        price:price,

        id:Date.now()

    };


    records.unshift(
        newRecord
    );


    saveRecords();


    /* =====================
       コンボ
       ===================== */

    combo++;


    /* =====================
       画面更新
       ===================== */

    updateDisplay();


    /* =====================
       🍌 バナナ
       ===================== */

    bananaRain();


    /* =====================
       🌈 派手な演出
       ===================== */

    showCelebration();


    /* =====================
       合計をポンッ
       ===================== */

    const totalBox =
        document.getElementById("total");


    totalBox.classList.remove(
        "total-pop"
    );


    void totalBox.offsetWidth;


    totalBox.classList.add(
        "total-pop"
    );


    /* =====================
       入力をリセット
       ===================== */

    document.getElementById(
        "price"
    ).value = "";


    document.getElementById(
        "item"
    ).value = "";


    /*
       日付はそのまま
    */

}


/* =========================
   🗑️ 1件削除
   ========================= */

function deleteRecord(index){

    const record =
        records[index];


    if(!record){

        return;

    }


    const ok =
        confirm(
            "この記録を消す？\n\n" +
            record.item +
            "\n" +
            record.price.toLocaleString() +
            "円"
        );


    if(!ok){

        return;

    }


    records.splice(
        index,
        1
    );


    saveRecords();


    /*
       削除したらコンボもリセット
    */

    combo = 0;


    updateDisplay();

}


/* =========================
   🧹 全削除
   ========================= */

function deleteAllRecords(){

    if(records.length === 0){

        alert(
            "消す記録がないよ🍌"
        );

        return;

    }


    const ok =
        confirm(
            "本当に全部の記録を消す？\n\n" +
            "この操作は元に戻せません。"
        );


    if(!ok){

        return;

    }


    records = [];


    combo = 0;


    saveRecords();


    updateDisplay();

}


/* =========================
   🍌 バナナを降らせる
   ========================= */

function bananaRain(){

    /*
       バナナの数
    */

    for(
        let i = 0;
        i < 25;
        i++
    ){

        const banana =
            document.createElement("div");


        banana.className =
            "falling-banana";


        banana.textContent =
            "🍌";


        /*
           横位置
        */

        banana.style.left =
            Math.random() * 100 +
            "vw";


        /*
           大きさ
        */

        banana.style.fontSize =
            (
                25 +
                Math.random() * 35
            ) +
            "px";


        /*
           落下速度
        */

        banana.style.animationDuration =
            (
                1.2 +
                Math.random() * 2
            ) +
            "s";


        /*
           開始タイミング
        */

        banana.style.animationDelay =
            (
                Math.random() * 0.5
            ) +
            "s";


        document.body.appendChild(
            banana
        );


        /*
           終わったら消す
        */

        setTimeout(
            () => {

                banana.remove();

            },
            4000
        );

    }

}


/* =========================
   🌈 成功演出
   ========================= */

function showCelebration(){

    const box =
        document.getElementById(
            "celebration"
        );


    const text =
        document.getElementById(
            "celebrationText"
        );


    /*
       コンボによって文字を変更
    */

    if(combo >= 5){

        text.textContent =
            "🔥🔥🔥 SUPER RECORD!! 🔥🔥🔥";

    }
    else if(combo >= 3){

        text.textContent =
            "🌈 GREAT RECORD!! 🌈";

    }
    else{

        text.textContent =
            "🍌 RECORD SUCCESS!! 🍌";

    }


    box.classList.remove(
        "show"
    );


    /*
       アニメーションを再起動
    */

    void box.offsetWidth;


    box.classList.add(
        "show"
    );

}


/* =========================
   Enterキーでも追加
   ========================= */

document.getElementById(
    "price"
).addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            addRecord();

        }

    }
);


/* =========================
   最初の画面表示
   ========================= */

updateDisplay();
