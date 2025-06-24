
async function checkAccess() {
    const phone = document.getElementById("phone").value.trim();
    const key = document.getElementById("key").value.trim();
    const resultEl = document.getElementById("result");

    if (!phone || !key) {
        resultEl.innerHTML = "Пожалуйста, введите номер и ключ.";
        return;
    }

    const res = await fetch("data.xlsx");
    const arrayBuffer = await res.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const match = data.find(entry => entry["Телефон"] === phone && entry["Ключ"] === key);

    if (match) {
        resultEl.innerHTML = `
            <strong>ФИО:</strong> ${match["ФИО"]}<br>
            <strong>Кол-во покупок:</strong> ${match["Покупок"]}<br>
            <strong>Сумма покупок:</strong> ${match["Сумма покупок"]}<br>
            <strong>Бонусы:</strong> ${match["Бонусы"]}
        `;
    } else {
        resultEl.innerHTML = "Неверный номер или ключ.";
    }
}
