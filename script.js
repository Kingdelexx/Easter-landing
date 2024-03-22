// select element
const form = document.querySelector("form");

async function submitForm(e) {
  e.preventDefault();
  const date = getDate();
  const input = e.target.querySelectorAll("input");
  const select = e.target.querySelectorAll("select");

  if (
    !input[0].value ||
    !input[1].value ||
    !input[2].value ||
    !input[3].value ||
    select[0].value === "--select plan--" ||
    select[1].value === "--select plan--"
  )
    return errorMsg();

  const formData = Object.fromEntries(new FormData(e.target));

  const data = await createNewUser({ ...formData, date });

  if (data) {
    window.location.href = "https://paystack.com/pay/devnaijaacademy";
    document.querySelector(".overlay").style.display = "none";
  }

  //   this.submit();
}

form.addEventListener("submit", submitForm);

//helper functions

function errorMsg() {
  const msgError = document.querySelector(".error-msg");

  msgError.textContent = "All fields is required!";
  msgError.style.right = "0";

  const timeoutID = setTimeout(() => {
    msgError.style.right = "-100%";
  }, 3000);

    return () => clearTimeout(timeoutID);
}

async function fetchData() {
  const res = await fetch(
    "https://easter-coding-default-rtdb.firebaseio.com/devnaija_easter_coding.json"
  );

  const data = await res.json();

  return data;
}

// async function isExist(user) {
//   const users = await fetchData();
//   const exist = users && users.find((old) => old.email === user.email);

//   return exist ? true : false;
// }

async function createNewUser(user) {
  document.querySelector(".overlay").style.display = "flex";
  const oldData = await fetchData();

  const newData = oldData ? oldData.concat(user) : [user];
  const res = await fetch(
    `https://easter-coding-default-rtdb.firebaseio.com/devnaija_easter_coding.json`,
    {
      method: "PUT",
      body: JSON.stringify(newData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) return;

  const data = await res.json();

  return data;
}

function getDate() {
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const date = `${day}-${month + 1}-${year}`;

  return date;
}
