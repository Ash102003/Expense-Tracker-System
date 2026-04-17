const API = "http://127.0.0.1:5000";

let editId = null;

// ADD or UPDATE
async function addExpense() {
  const title = document.getElementById("title").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const category = document.getElementById("category").value.trim();

  // validation
  if (!title || !amount || !category) {
    alert("Please fill all fields");
    return;
  }

  try {
    if (editId) {
      // UPDATE
      await fetch(API + "/update/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          category
        })
      });

      editId = null;
      document.getElementById("mainBtn").innerText = "Add";

    } else {
      // ADD
      await fetch(API + "/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          category
        })
      });
    }

    // clear inputs
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

    getExpenses();

  } catch (error) {
    console.error("Error:", error);
  }
}

// GET ALL
async function getExpenses() {
  try {
    const res = await fetch(API + "/all");
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    let total = 0;

    data.forEach(exp => {
      total += exp.amount;

      const li = document.createElement("li");

      li.innerHTML = `
        <div class="flex justify-between items-center bg-white border rounded-xl p-4 shadow hover:shadow-md transition">

          <div>
            <p class="font-semibold text-lg">${exp.title}</p>
            <p class="text-sm text-gray-500">₹${exp.amount} • ${exp.category}</p>
          </div>

          <div class="flex gap-2">

            <button onclick="editExpense('${exp._id}', '${exp.title}', '${exp.amount}', '${exp.category}')"
              class="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition">
              ✏️
            </button>

            <button onclick="deleteExpense('${exp._id}')"
              class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
              🗑️
            </button>

          </div>

        </div>
      `;

      list.appendChild(li);
    });

    document.getElementById("total").innerText = total;

  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// DELETE
async function deleteExpense(id) {
  try {
    await fetch(API + "/delete/" + id, {
      method: "DELETE"
    });

    getExpenses();
  } catch (error) {
    console.error("Delete error:", error);
  }
}

// EDIT
function editExpense(id, title, amount, category) {
  document.getElementById("title").value = title;
  document.getElementById("amount").value = amount;
  document.getElementById("category").value = category;

  editId = id;

  document.getElementById("mainBtn").innerText = "Update";
}

// load on start
getExpenses();