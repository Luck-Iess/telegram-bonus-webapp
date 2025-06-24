document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const loadingDiv = document.getElementById("loading");
    const resultDiv = document.getElementById("result");
    const toggleBtn = document.getElementById("toggleKey");
    const keyInput = document.getElementById("key");

    // Переключение показа ключа
    toggleBtn.addEventListener("click", () => {
        if (keyInput.type === "password") {
            keyInput.type = "text";
            toggleBtn.textContent = "🙈";
        } else {
            keyInput.type = "password";
            toggleBtn.textContent = "👁️";
        }
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const phoneInput = document.getElementById("phone").value.trim();
        const keyValue = keyInput.value.trim().toLowerCase();
        const inputPhone = normalizePhone(phoneInput);

        // Показать "загрузка"
        loadingDiv.style.display = "block";
        resultDiv.style.display = "none";

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const res = await fetch("data.xlsx");
            const arrayBuffer = await res.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            const found = sheet.find(row =>
                normalizePhone(row["Телефон"]) === inputPhone &&
                String(row["Ключ"]).trim().toLowerCase() === keyValue
            );

            loadingDiv.style.display = "none";
            resultDiv.style.display = "block";

            if (found) {
                form.style.display = "none";
                resultDiv.innerHTML = `
                    <h2>Ваши данные:</h2>
                    <p><strong>ФИО:</strong> ${found["ФИО"]}</p>
                    <p><strong>Покупок:</strong> ${found["Покупок"]}</p>
                    <p><strong>Сумма покупок:</strong> ${found["Сумма покупок"]}</p>
                    <p><strong>Бонусы:</strong> ${found["Бонусы"]}</p>
                `;
            } else {
                resultDiv.innerHTML = `<p style='color:red;'>Неверный номер телефона или ключ.</p>`;
            }
        } catch (error) {
            console.error("Ошибка при загрузке таблицы:", error);
            loadingDiv.style.display = "none";
            resultDiv.style.display = "block";
            resultDiv.innerHTML = "<p style='color:red;'>Ошибка при загрузке данных.</p>";
        }
    });

    function normalizePhone(phone) {
        if (!phone) return "";
        return String(phone).replace(/[^0-9]/g, "").replace(/^8/, "7");
    }
});
