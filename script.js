function openModal() {
  document.getElementById("paystubModal").style.display = "block";
}

function closeModal() {
  document.getElementById("paystubModal").style.display = "none";
}

function togglePayFields() {
  const type = document.getElementById("payType").value;
  document.getElementById("annualFields").style.display =
    type === "annual" ? "block" : "none";
  document.getElementById("hourlyFields").style.display =
    type === "hourly" ? "block" : "none";
}

function addBonusField() {
  const div = document.createElement("div");
  div.classList.add("bonusRow");
  div.innerHTML = `
    <input type="text" class="bonusName" placeholder="Bonus name">
    <input type="number" class="bonusAmount" placeholder="Amount ($)">
  `;
  document.getElementById("bonusList").appendChild(div);
}

function addDeductionField() {
  const div = document.createElement("div");
  div.classList.add("deductionRow");
  div.innerHTML = `
    <input type="text" class="deductionName" placeholder="Deduction name">
    <input type="number" class="deductionAmount" placeholder="Amount ($)">
  `;
  document.getElementById("deductionList").appendChild(div);
}

function calcFederalTax(amount) {
  if (amount <= 423) return amount * 0.10;
  if (amount <= 1716) return amount * 0.12;
  if (amount <= 3668) return amount * 0.22;
  if (amount <= 7003) return amount * 0.24;
  return amount * 0.32;
}

function calcStateTax(state, amount) {
  const rates = { MS: 0.05, AL: 0.05, TN: 0, TX: 0, FL: 0 };
  return amount * (rates[state] || 0.05);
}

function submitPaystub() {
  const empName = document.getElementById("empName").value || "—";
  const empPosition = document.getElementById("empPosition").value || "—";
  const empDept = document.getElementById("empDept").value || "—";
  const empId = document.getElementById("empId").value || "—";
  const empLocation = document.getElementById("empLocation").value || "—";
  const empAcct = document.getElementById("empAcct").value || "";
  const payPeriod = document.getElementById("payPeriod").value || "—";
  const payDate = document.getElementById("payDate").value || "—";

  const payType = document.getElementById("payType").value;
  let biweeklyGross = 0;
  let earningsRows = "";

  if (payType === "annual") {
    const annualSalary = parseFloat(document.getElementById("annualSalary").value) || 0;
    biweeklyGross = annualSalary / 26;
    earningsRows += `
      <tr>
        <td>Base Salary (Bi-weekly)</td>
        <td>—</td>
        <td>—</td>
        <td>$${biweeklyGross.toFixed(2)}</td>
      </tr>
    `;
  } else {
    const hourlyRate = parseFloat(document.getElementById("hourlyRate").value) || 0;
    const hoursPerWeek = parseFloat(document.getElementById("hoursPerWeek").value) || 0;
    const hoursBiweekly = hoursPerWeek * 2;
    biweeklyGross = hourlyRate * hoursBiweekly;
    earningsRows += `
      <tr>
        <td>Hourly Pay</td>
        <td>${hoursBiweekly.toFixed(2)}</td>
        <td>$${hourlyRate.toFixed(2)}</td>
        <td>$${biweeklyGross.toFixed(2)}</td>
      </tr>
    `;
  }

  let bonusTotal = 0;
  let bonusRows = "";
  document.querySelectorAll(".bonusRow").forEach(row => {
    const name = row.querySelector(".bonusName").value || "Bonus";
    const amount = parseFloat(row.querySelector(".bonusAmount").value) || 0;
    if (amount > 0) {
      bonusTotal += amount;
      bonusRows += `
        <tr>
          <td>${name}</td>
          <td>—</td>
          <td>—</td>
          <td>$${amount.toFixed(2)}</td>
        </tr>
      `;
    }
  });

  earningsRows += bonusRows;

  const gross = biweeklyGross + bonusTotal;

  let deductionTotal = 0;
  let deductionRows = "";
  document.querySelectorAll(".deductionRow").forEach(row => {
    const name = row.querySelector(".deductionName").value || "Deduction";
    const amount = parseFloat(row.querySelector(".deductionAmount").value) || 0;
    if (amount > 0) {
      deductionTotal += amount;
      deductionRows += `
        <tr>
          <td>${name}</td>
          <td>$${amount.toFixed(2)}</td>
        </tr>
      `;
    }
  });

  const health = parseFloat(document.getElementById("healthAmount").value) || 0;
  const dental = parseFloat(document.getElementById("dentalAmount").value) || 0;
  const vision = parseFloat(document.getElementById("visionAmount").value) || 0;
  const fsa = parseFloat(document.getElementById("fsaAmount").value) || 0;

  const state = document.getElementById("state").value || "MS";
  const federalTax = calcFederalTax(gross);
  const stateTax = calcStateTax(state, gross);

  const totalDeductions =
    deductionTotal + federalTax + stateTax + health + dental + vision + fsa;

  const net = gross - totalDeductions;

  document.getElementById("empNameDisplay").textContent = empName;
  document.getElementById("empPositionDisplay").textContent = empPosition;
  document.getElementById("empDeptDisplay").textContent = empDept;
  document.getElementById("empIdDisplay").textContent = empId;
  document.getElementById("empLocationDisplay").textContent = empLocation;
  document.getElementById("empAcctDisplay").textContent =
    empAcct ? `**** **** **** ${empAcct}` : "—";
  document.getElementById("payPeriodDisplay").textContent = payPeriod;
  document.getElementById("payDateDisplay").textContent = payDate;

  const companyName = document.getElementById("companyName").value || "Your Company Name";
  const companyInfo = document.getElementById("companyInfo").value || "© Your Company";

  document.getElementById("companyNameDisplay").textContent = companyName;
  document.getElementById("companyInfoDisplay").textContent = companyInfo;

  const logoFile = document.getElementById("companyLogo").files[0];
  if (logoFile) {
    document.getElementById("companyLogoDisplay").src =
      URL.createObjectURL(logoFile);
  }

  document.getElementById("earningsTable").innerHTML =
    earningsRows +
    `
      <tr>
        <td><strong>Total Gross Pay</strong></td>
        <td>—</td>
        <td>—</td>
        <td><strong>$${gross.toFixed(2)}</strong></td>
      </tr>
    `;

  document.getElementById("deductionsTable").innerHTML =
    deductionRows +
    `
      <tr><td>Federal Income Tax</td><td>$${federalTax.toFixed(2)}</td></tr>
      <tr><td>State Income Tax</td><td>$${stateTax.toFixed(2)}</td></tr>
      <tr><td>Health Insurance</td><td>$${health.toFixed(2)}</td></tr>
      <tr><td>Dental Insurance</td><td>$${dental.toFixed(2)}</td></tr>
      <tr><td>Vision Insurance</td><td>$${vision.toFixed(2)}</td></tr>
      <tr><td>FSA Contribution</td><td>$${fsa.toFixed(2)}</td></tr>
      <tr><td><strong>Total Deductions</strong></td><td><strong>$${totalDeductions.toFixed(2)}</strong></td></tr>
    `;

  document.getElementById("grossPayDisplay").textContent = `$${gross.toFixed(2)}`;
  document.getElementById("totalDeductionsDisplay").textContent = `$${totalDeductions.toFixed(2)}`;
  document.getElementById("netPayDisplay").textContent = `$${net.toFixed(2)}`;

  closeModal();
}

function downloadStub() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "paystub.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
