/* ========================================
   🍌 ばなな家計簿 JavaScript
======================================== */


/* ========================================
   データ
======================================== */


let records = [];

let combo = 0;


/* ========================================
   保存データ
======================================== */


const savedRecords =
    localStorage.getItem(
        "bananaKakeiboRecords"
    );


if (savedRecords) {

    try {

        records =
            JSON.parse(savedRecords);

        if (!Array.isArray(records)) {

            records = [];

        }

    } catch (error) {

        records = [];

    }

}


/* ========================================
   予算
======================================== */


let budget =
    Number(
        localStorage.getItem(
            "bananaKakeiboBudget"
        )
    ) || 0;


/* ========================================
   今日の日付
======================================== */


function getToday() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


document.getElementById(
    "date"
).value =
    getToday();


/* ========================================
   今月
======================================== */


function getCurrentMonth() {

    const now =
        new Date();

    return (
        now.getFullYear() +
        "-" +
        String(
            now.getMonth() + 1
        ).padStart(2, "0")
    );

}


document.getElementById(
    "rankingMonth"
).value =
    getCurrentMonth();


/* ========================================
   保存
======================================== */


function saveRecords() {

    localStorage.setItem(
        "bananaKakeiboRecords",
        JSON.stringify(records)
    );

}


/* ========================================
   合計
======================================== */


function getTotal() {

    return records.reduce(
        function(sum, record) {

            return (
                sum +
                Number(record.price)
            );

        },
        0
    );

}


/* ========================================
   月の記録
======================================== */


function getMonthRecords(month) {

    return records.filter(
        function(record) {

            return record.date.startsWith(
                month
            );

        }
    );

}


/* ========================================
   月の合計
======================================== */


function getMonthTotal(month) {

    return getMonthRecords(month)
        .reduce(
            function(sum, record) {

                return (
                    sum +
                    Number(record.price)
                );

            },
            0
        );

}


/* ========================================
   💰 予算設定
======================================== */


function setBudget() {

    const input =
        Number(
            document.getElementById(
                "budget"
            ).value
        );


    if (!input || input <= 0) {

        alert(
            "予算を入力してね🍌"
        );

        return;

    }


    budget = input;


    localStorage.setItem(
        "bananaKakeiboBudget",
        budget
    );


    document.getElementById(
        "budget"
    ).value = "";


    updateDisplay();

}


/* ========================================
   🍌 メーター
======================================== */


function updateMeter() {

    const month =
        getCurrentMonth();


    const total =
        getMonthTotal(month);


    const fill =
        document.getElementById(
            "meterFill"
        );


    const text =
        document.getElementById(
            "meterText"
        );


    const message =
        document.getElementById(
            "budgetMessage"
        );


    fill.classList.remove(
        "danger"
    );


    if (!budget) {

        fill.style.width =
            "0%";

        text.textContent =
            total.toLocaleString() +
            "円 / 予算未設定";

        message.textContent =
            "まだ予算が設定されてないよ🍌";

        return;

    }


    const percent =
        (total / budget) * 100;


    fill.style.width =
        Math.min(
            percent,
            100
        ) + "%";


    text.textContent =
        total.toLocaleString() +
        "円 / " +
        budget.toLocaleString() +
        "円";


    if (total > budget) {

        fill.classList.add(
            "danger"
        );


        message.textContent =
            "🚨🍌 バナナ食べすぎ警報！！ " +
            (total - budget)
                .toLocaleString() +
            "円オーバー！";

        message.classList.add(
            "over-budget"
        );

    }
    else {

        message.classList.remove(
            "over-budget"
        );


        const remaining =
            budget - total;


        message.textContent =
            "🍌 あと " +
            remaining.toLocaleString() +
            "円使えるよ！";

    }

}


/* ========================================
   📊 月別ランキング
======================================== */


function updateRanking() {

    const month =
        document.getElementById(
            "rankingMonth"
        ).value;


    const list =
        document.getElementById(
            "categoryList"
        );


    if (!month) {

        list.textContent =
            "月を選んでね🍌";

        return;

    }


    const monthRecords =
        getMonthRecords(month);


    if (
        monthRecords.length === 0
    ) {

        list.textContent =
            "この月はまだ記録がないよ🍌";

        return;

    }


    const categories = {};


    monthRecords.forEach(
        function(record) {

            if (
                !categories[
                    record.item
                ]
            ) {

                categories[
                    record.item
                ] = 0;

            }


            categories[
                record.item
            ] += Number(
                record.price
            );

        }
    );


    const sorted =
        Object.entries(
            categories
        ).sort(
            function(a, b) {

                return b[1] - a[1];

            }
        );


    list.innerHTML = "";


    sorted.forEach(
        function(entry, index) {

            const name =
                entry[0];

            const money =
                entry[1];


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            const left =
                document.createElement(
                    "div"
                );


            left.className =
                "category-name";


            let medal = "";


            if (index === 0) {
                medal = "🥇";
            }
            else if (index === 1) {
                medal = "🥈";
            }
            else if (index === 2) {
                medal = "🥉";
            }
            else {
                medal = "🍌";
            }


            left.textContent =
                medal +
                " " +
                name;


            const right =
                document.createElement(
                    "div"
                );


            right.className =
                "category-money";


            right.textContent =
                money.toLocaleString() +
                "円";


            row.appendChild(
                left
            );


            row.appendChild(
                right
            );


            list.appendChild(
                row
            );

        }
    );

}


/* ========================================
   📖 記録表示
======================================== */


function renderRecords() {

    const list =
        document.getElementById(
            "recordList"
        );


    list.innerHTML = "";


    if (
        records.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty";


        empty.textContent =
            "まだ記録がないよ🍌";


        list.appendChild(
            empty
        );


        return;

    }


    records.forEach(
        function(record, index) {

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


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-button";


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "この記録を削除";


            deleteButton.onclick =
                function() {

                    deleteRecord(
                        index
                    );

                };


            li.appendChild(
                date
            );


            li.appendChild(
                item
            );


            li.appendChild(
                price
            );


            li.appendChild(
                deleteButton
            );


            list.appendChild(
                li
            );

        }
    );

}


/* ========================================
   💰 記録追加
======================================== */


function addRecord() {

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


    if (!date) {

        alert(
            "📅 日付を選んでね🍌"
        );

        return;

    }


    if (!item) {

        alert(
            "💰 何に使ったか選んでね🍌"
        );

        return;

    }


    if (!price || price <= 0) {

        alert(
            "💴 金額を入力してね🍌"
        );

        return;

    }


    const newRecord = {

        date: date,

        item: item,

        price: price,

        id: Date.now()

    };


    records.unshift(
        newRecord
    );


    saveRecords();


    combo++;


    updateDisplay();


    bananaRain();


    showCelebration();


    const totalBox =
        document.getElementById(
            "total"
        );


    totalBox.classList.remove(
        "total-pop"
    );


    void totalBox.offsetWidth;


    totalBox.classList.add(
        "total-pop"
    );


    document.getElementById(
        "price"
    ).value = "";


    document.getElementById(
        "item"
    ).value = "";

}


/* ========================================
   🗑️ 1件削除
======================================== */


function deleteRecord(index) {

    const record =
        records[index];


    if (!record) {

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


    if (!ok) {

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


/* ========================================
   🗑️ 全削除
======================================== */


function deleteAllRecords() {

    if (
        records.length === 0
    ) {

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


    if (!ok) {

        return;

    }


    records = [];


    combo = 0;


    saveRecords();


    updateDisplay();

}


/* ========================================
   🍌 バナナ降雨
======================================== */


function bananaRain() {

    for (
        let i = 0;
        i < 30;
        i++
    ) {

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
            function() {

                banana.remove();

            },
            4000
        );

    }

}


/* ========================================
   🎰 パチンコ風演出
======================================== */


function showCelebration() {

    const effect =
        document.getElementById(
            "effect"
        );


    const text =
        document.getElementById(
            "effectText"
        );


    if (combo >= 5) {

        text.textContent =
            "🔥🔥🔥 SUPER RECORD!! 🔥🔥🔥";

    }
    else if (combo >= 3) {

        text.textContent =
            "🌈 GREAT RECORD!! 🌈";

    }
    else {

        text.textContent =
            "🍌 RECORD SUCCESS!! 🍌";

    }


    effect.classList.remove(
        "show"
    );


    void effect.offsetWidth;


    effect.classList.add(
        "show"
    );

}


/* ========================================
   画面更新
======================================== */


function updateDisplay() {

    const total =
        getTotal();


    document.getElementById(
        "total"
    ).textContent =
        "合計：" +
        total.toLocaleString() +
        "円";


    updateMeter();


    updateRanking();


    renderRecords();

}


/* ========================================
   🎛️ ボタン
======================================== */


document.getElementById(
    "addButton"
).addEventListener(
    "click",
    addRecord
);


document.getElementById(
    "budgetButton"
).addEventListener(
    "click",
    setBudget
);


document.getElementById(
    "deleteAllButton"
).addEventListener(
    "click",
    deleteAllRecords
);


document.getElementById(
    "rankingMonth"
).addEventListener(
    "change",
    updateRanking
);


/* ========================================
   Enterキー
======================================== */


document.getElementById(
    "price"
).addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            addRecord();

        }

    }
);


document.getElementById(
    "budget"
).addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            setBudget();

        }

    }
);


/* ========================================
   最初の表示
======================================== */


updateDisplay();

const bgm = document.getElementById("bgm");
const bgmButton = document.getElementById("bgmButton");

bgm.volume = 0.3;

bgmButton.addEventListener("click", async function(){

    try {

        if (bgm.paused) {

            await bgm.play();

            bgmButton.textContent = "⏸️ BGMを停止";

        } else {

            bgm.pause();

            bgmButton.textContent = "🎵 BGMを再生";

        }

    } catch (error) {

        console.log("BGM再生エラー:", error);

        alert("BGMを再生できなかったよ🍌");

    }

});
