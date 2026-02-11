function openModal() {
  document.getElementById("paystubModal").style.display = "block";
}

function closeModal() {
  document.getElementById("paystubModal").style.display = "none";
}

/* -----------------------------
   TAX CALCULATIONS
------------------------------*/

function calcFederalTax(amount) {
  if (amount <= 423) return amount * 0.10;          // 11,000 / 26
  if (amount <= 1716) return amount * 0.12;         // 44,725 / 26
  if (amount <= 3668) return amount * 0.22;         // 95,375 / 26
  if (amount <= 7003) return amount * 0.24;         // 182,100 / 26
  return amount * 0.32;
}

function calcStateTax(state, amount) {
  const rates = { MS: 0.05, AL: 0.05, TN: 0, TX: 0, FL: 0 };
  return amount * (rates[state] || 0.05);
}

/* -----------------------------
   MAIN PAYSTUB GENERATION
------------------------------*/

function submitPaystub() {
  /* --- Employee Info --- */
  const empName = document.getElementById("empName").value;
  const empPosition = document.getElementById("empPosition").value;
  const empDept = document.getElementById("empDept").value;
  const empId = document.getElementById("empId").value;
  const empLocation = document.getElementById("empLocation").value;
  const empAcct = document.getElementById("empAcct").value;
  const payPeriod = document.getElementById("payPeriod").value;
  const payDate = document.getElementById("payDate").value;

  /* --- Pay Type --- */
  const payType = document.getElementById("payType").value;

  let biweeklyGross = 0;
  let earningsRows = "";

  if (payType === "annual") {
    const annualSalary = parseFloat(document.getElementById("annualSalary").value) || 0;
    biweeklyGross = annualSalary / 26;

    earningsRows += `
      <tr><td>Base Salary (Bi‑Weekly)</td><td>—</td><td>—</td><td>$${biweeklyGross.toFixed(2)}</td></tr>
    `;
  }

  if (payType === "hourly") {
    const hourlyRate = parseFloat(document.getElementById("hourlyRate").value) || 0;
    const hoursPerWeek = parseFloat(document.getElementById("hoursPerWeek").value) || 0;

    biweeklyGross = hourlyRate * hoursPerWeek * 2;

    earningsRows += `
      <tr><td>Hourly Pay</td><td>${hoursPerWeek * 2}</td><td>$${hourlyRate.toFixed(2)}</td><td>$${biweeklyGross.toFixed(2)}</td></tr>
    `;
  }

  /* --- Bonus --- */
  const bonus = parseFloat(document.getElementById("bonus").value) || 0;
  if (bonus > 0) {
    earningsRows += `
      <tr><td>Bonus</td><td>—</td><td>—</td><td>$${bonus.toFixed(2)}</td></tr>
    `;
  }

  const gross = biweeklyGross + bonus;

  /* --- Deductions --- */
  const extraDeductions = parseFloat(document.getElementById("extraDeductions").value) || 0;
  const state = document.getElementById("state").value;

  const health = document.getElementById("healthIns").checked ? 150 : 0;
  const dental = document.getElementById("dentalIns").checked ? 25 : 0;
  const vision = document.getElementById("visionIns").checked ? 10 : 0;
  const fsa = parseFloat(document.getElementById("fsaAmount").value) || 0;

  const federalTax = calcFederalTax(gross);
  const stateTax = calcStateTax(state, gross);

  const totalDeductions =
    federalTax + stateTax + extraDeductions + health + dental + vision + fsa;

  const net = gross - totalDeductions;

  /* -----------------------------
     UPDATE PAYSTUB DISPLAY
  ------------------------------*/

  document.getElementById("empNameDisplay").textContent = empName || "—";
  document.getElementById("empPositionDisplay").textContent = empPosition || "—";
  document.getElementById("empDeptDisplay").textContent = empDept || "—";
  document.getElementById("empIdDisplay").textContent = empId || "—";
  document.getElementById("empLocationDisplay").textContent = empLocation || "—";
  document.getElementById("empAcctDisplay").textContent = empAcct ? `**** **** **** ${empAcct}` : "—";
  document.getElementById("payPeriodDisplay").textContent = payPeriod || "—";
  document.getElementById("payDateDisplay").textContent = payDate || "—";

  /* --- Company Info --- */
  const companyName = document.getElementById("companyName").value;
  const companyInfo = document.getElementById("companyInfo").value;

  document.getElementById("companyNameDisplay").textContent = companyName || "Your Company Name";
  document.getElementById("companyInfoDisplay").textContent = companyInfo || "© Your Company";

  /* --- Logo --- */
  const logoFile = document.getElementById("companyLogo").files[0];
  if (logoFile) {
    document.getElementById("companyLogoDisplay").src = URL.createObjectURL(logoFile);
  }

  /* --- Earnings Table --- */
  earningsRows += `
    <tr><td><strong>Total Gross Pay</strong></td><td>—</td><td>—</td><td><strong>$${gross.toFixed(2)}</strong></td></tr>
  `;
  document.getElementById("earningsTable").innerHTML = earningsRows;

  /* --- Deductions Table --- */
  document.getElementById("deductionsTable").innerHTML = `
    <tr><td>Federal Income Tax</td><td>$${federalTax.toFixed(2)}</td></tr>
    <tr><td>State Income Tax</td><td>$${stateTax.toFixed(2)}</td></tr>
    <tr><td>Health Insurance</td><td>$${health.toFixed(2)}</td></tr>
    <tr><td>Dental Insurance</td><td>$${dental.toFixed(2)}</td></tr>
    <tr><td>Vision Insurance</td><td>$${vision.toFixed(2)}</td></tr>
    <tr><td>FSA Contribution</td><td>$${fsa.toFixed(2)}</td></tr>
    <tr><td>Other Deductions</td><td>$${extraDeductions.toFixed(2)}</td></tr>
    <tr><td><strong>Total Deductions</strong></td><td><strong>$${totalDeductions.toFixed(2)}</strong></td></tr>
  `;

  /* --- Totals --- */
  document.getElementById("grossPayDisplay").textContent = `$${gross.toFixed(2)}`;
  document.getElementById("totalDeductionsDisplay").textContent = `$${totalDeductions.toFixed(2)}`;
  document.getElementById("netPayDisplay").textContent = `$${net.toFixed(2)}`;

  closeModal();
}

/* -----------------------------
   DOWNLOAD HTML
------------------------------*/

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
