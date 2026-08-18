/* =========================
   🍌 ばなな家計簿
========================= */


let records = [];

let combo = 0;


/* =========================
   保存データ読み込み
========================= */

const savedRecords =
    localStorage.getItem(
        "bananaKakeiboRecords"
    );


if(savedRecords){

    try{

        const data =
            JSON.parse(savedRecords);

        if(Array.isArray(data)){

            records = data;

        }

    }catch(error){

        records = [];

    }

}


/* =========================
   今日の日付
========================= */

function getToday(){

    const now =
        new Date();

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

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


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
   合計
========================= */

function getTotal(){

    return records.reduce(

        function(sum,record){

            return sum +
                Number(record.price || 0);

        },

        0

    );

}


/* =========================
   画面更新
========================= */

function updateDisplay(){

    const total =
        getTotal();


    /* 合計 */

    const totalElement =
        document.getElementById(
            "total"
        );


    if(totalElement){

        totalElement.textContent =
            "合計：" +
            total.toLocaleString() +
            "円";

    }


    /* 件数 */

    const count =
        document.getElementById(
            "count"
        );


    if(count){

        count.textContent =
            "📖 記録：" +
            records.length +
            "件";

    }


    /* コンボ */

    const comboElement =
        document.getElementById(
            "combo"
        );


    if(comboElement){

        comboElement.textContent =
            "🔥 " +
            combo +
            " COMBO";

    }


    /* メーター */

    const meterFill =
        document.getElementById(
            "meterFill"
        );


    const meterText =
        document.getElementById(
            "meterText"
        );


    if(meterFill){

        const percent =
            Math.min(
                total / 5000 * 100,
                100
            );

        meterFill.style.width =
            percent + "%";

    }


    if(meterText){

        if(total >= 5000){

            meterText.textContent =
                "🍌🍌🍌 バナナMAX！！ 🍌🍌🍌";

        }
        else{

            meterText.textContent =
                total.toLocaleString() +
                "円使った！ 🍌";

        }

    }


    renderRecords();

    updateCategories(total);

}


/* =========================
   記録一覧
========================= */

function renderRecords(){

    const list =
        document.getElementById(
            "recordList"
        );


    const empty =
        document.getElementById(
            "emptyMessage"
        );


    if(!list){

        return;

    }


    list.innerHTML = "";


    if(records.length === 0){

        if(empty){

            empty.style.display =
                "block";

        }

        return;

    }


    if(empty){

        empty.style.display =
            "none";

    }


    records.forEach(

        function(record,index){

            const li =
                document.createElement(
                    "li"
                );


            const date =
                document.createElement(
                    "div"
                );


            date.className =
                "record-date";


            date.textContent =
                "📅 " +
                record.date;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "record-item";


            item.textContent =
                "💰 " +
                record.item;


            const price =
                document.createElement(
                    "div"
                );


            price.className =
                "record-price";


            price.textContent =
                "💴 " +
                Number(
                    record.price
                ).toLocaleString() +
                "円";


            /* 削除 */

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.className =
                "delete-button";


            deleteButton.textContent =
                "🗑️ 削除";


            deleteButton.onclick =
                function(){

                    deleteRecord(index);

                };


            li.appendChild(date);

            li.appendChild(item);

            li.appendChild(price);

            li.appendChild(
                deleteButton
            );


            list.appendChild(li);

        }

    );

}


/* =========================
   📊 カテゴリー
========================= */

function updateCategories(total){

    const categoryList =
        document.getElementById(
            "categoryList"
        );


    if(!categoryList){

        return;

    }


    if(records.length === 0){

        categoryList.textContent =
            "まだ記録がないよ🍌";

        return;

    }


    const categories = {};


    records.forEach(

        function(record){

            if(
                !categories[
                    record.item
                ]
            ){

                categories[
                    record.item
                ] = 0;

            }


            categories[
                record.item
            ] += Number(
                record.price || 0
            );

        }

    );


    const sorted =
        Object.entries(categories)
        .sort(
            function(a,b){

                return b[1] - a[1];

            }
        );


    categoryList.innerHTML = "";


    sorted.forEach(

        function(entry){

            const name =
                entry[0];

            const money =
                entry[1];


            const percent =
                total > 0

                ? Math.round(
                    money / total * 100
                )

                : 0;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            const nameElement =
                document.createElement(
                    "span"
                );


            nameElement.className =
                "category-name";


            nameElement.textContent =
                name;


            const moneyElement =
                document.createElement(
                    "span"
                );


            moneyElement.className =
                "category-money";


            moneyElement.textContent =
                money.toLocaleString() +
                "円 (" +
                percent +
                "%)";


            row.appendChild(
                nameElement
            );


            row.appendChild(
                moneyElement
            );


            categoryList.appendChild(
                row
            );

        }

    );

}


/* =========================
   💰 記録追加
========================= */

function addRecord(){

    const date =
        document.getElementById(
            "date"
        ).value;


    const item =
        document.getElementById(
            "item"
        ).value;


    const price =
        Number(
            document.getElementById(
                "price"
            ).value
        );


    /* 入力チェック */

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


    /* 記録 */

    records.unshift({

        date:date,

        item:item,

        price:price,

        id:Date.now()

    });


    saveRecords();


    combo++;


    updateDisplay();


    /* 🍌 バナナ */

    bananaRain();


    /* 🎰 演出 */

    showCelebration();


    /* 合計ポンッ */

    const totalBox =
        document.getElementById(
            "total"
        );


    if(totalBox){

        totalBox.classList.remove(
            "total-pop"
        );


        void totalBox.offsetWidth;


        totalBox.classList.add(
            "total-pop"
        );

    }


    /* 入力リセット */

    document.getElementById(
        "price"
    ).value = "";


    document.getElementById(
        "item"
    ).value = "";


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

            Number(
                record.price
            ).toLocaleString() +

            "円"

        );


    if(!ok){

        return;

    }


    records.splice(
        index,
        1
    );


    combo = 0;


    saveRecords();


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
            "本当に全部の記録を消す？"
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
   🍌 バナナ降下
========================= */

function bananaRain(){

    for(
        let i = 0;
        i < 25;
        i++
    ){

        const banana =
            document.createElement(
                "div"
            );


        banana.className =
            "falling-banana";


        banana.textContent =
            "🍌";


        banana.style.left =
            Math.random() * 100 +
            "vw";


        banana.style.fontSize =
            (
                25 +
                Math.random() * 35
            ) +
            "px";


        banana.style.animationDuration =
            (
                1.2 +
                Math.random() * 2
            ) +
            "s";


        banana.style.animationDelay =
            (
                Math.random() * 0.5
            ) +
            "s";


        document.body.appendChild(
            banana
        );


        setTimeout(

            function(){

                banana.remove();

            },

            4000

        );

    }

}


/* =========================
   🌈 パチンコ演出
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


    if(!box || !text){

        return;

    }


    if(combo >= 10){

        text.textContent =
            "🌈🍌 ULTRA BANANA!! 🍌🌈";

    }
    else if(combo >= 5){

        text.textContent =
            "🔥🍌 SUPER RECORD!! 🍌🔥";

    }
    else if(combo >= 3){

        text.textContent =
            "🌈🍌 GREAT RECORD!! 🍌🌈";

    }
    else{

        text.textContent =
            "🍌 RECORD SUCCESS!! 🍌";

    }


    box.classList.remove(
        "show"
    );


    void box.offsetWidth;


    box.classList.add(
        "show"
    );


    setTimeout(

        function(){

            box.classList.remove(
                "show"
            );

        },

        1000

    );

}


/* =========================
   ボタン設定
========================= */

function setupButtons(){

    const addButton =
        document.getElementById(
            "addButton"
        );


    if(addButton){

        addButton.addEventListener(
            "click",
            addRecord
        );

    }


    const deleteAllButton =
        document.getElementById(
            "deleteAllButton"
        );


    if(deleteAllButton){

        deleteAllButton.addEventListener(
            "click",
            deleteAllRecords
        );

    }


    const price =
        document.getElementById(
            "price"
        );


    if(price){

        price.addEventListener(

            "keydown",

            function(event){

                if(
                    event.key === "Enter"
                ){

                    addRecord();

                }

            }

        );

    }

}


/* =========================
   起動
========================= */

function startKakeibo(){

    const date =
        document.getElementById(
            "date"
        );


    if(date){

        date.value =
            getToday();

    }


    setupButtons();


    updateDisplay();

}


/* =========================
   開始
========================= */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(

        "DOMContentLoaded",

        startKakeibo

    );

}
else{

    startKakeibo();

}
