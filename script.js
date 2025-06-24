document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const phoneInput = document.getElementById("phone").value.trim();
    const keyInput = document.getElementById("key").value.trim().toLowerCase();

    const inputPhone = normalizePhone(phoneInput);

    try {
        const res = await fetch("data.xlsx");
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const found = sheet.find(row =>
            normalizePhone(row["Телефон"]) === inputPhone &&
            String(row["Ключ"]).trim().toLowerCase() === keyInput
        );

        if (found) {
            document.getElementById("result").innerHTML = `
                <p><strong>ФИО:</strong> ${found["ФИО"]}</p>
                <p><strong>Покупок:</strong> ${found["Покупок"]}</p>
                <p><strong>Сумма покупок:</strong> ${found["Сумма покупок"]}</p>
                <p><strong>Бонусы:</strong> ${found["Бонусы"]}</p>
            `;
        } else {
            document.getElementById("result").innerHTML = "<p style='color:red;'>Неверный номер телефона или ключ.</p>";
        }
    } catch (error) {
        console.error("Ошибка при загрузке таблицы:", error);
        document.getElementById("result").innerHTML = "<p style='color:red;'>Ошибка при загрузке данных.</p>";
    }
});

function normalizePhone(phone) {
    // Приводим номер к виду "87701112233" без плюсов, пробелов, скобок
    return phone.replace(/[^0-9]/g, "").replace(/^8/, "7"); // 8700 → 7700
}
