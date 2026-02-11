function openModal() {
  document.getElementById("paystubModal").style.display = "block";
}

function closeModal() {
  document.getElementById("paystubModal").style.display = "none";
}

function calcFederalTax(salary) {
  if (salary <= 11000) return salary * 0.10;
  if (salary <= 44725) return salary * 0.12;
  if (salary <= 95375) return salary * 0.22;
  if (salary <= 182100) return salary * 0.24;
  return salary * 0.32;
}

function calcStateTax(state, salary) {
  const rates = { MS: 0.05, AL: 0.05, TN: 0, TX: 0, FL: 0 };
  return salary * (rates[state] || 0.05);
}

function submitPaystub() {
  const empName = document.getElementById("empName").value;
  const empPosition = document.getElementById("empPosition").value;
  const empDept = document.getElementById("empDept").value;
  const empId = document.getElementById("empId").value;
  const empLocation = document.getElementById("empLocation").value;
  const empAcct = document.getElementById("empAcct").value;
  const payPeriod = document.getElementById("payPeriod").value;
  const payDate = document.getElementById("payDate").value;

  const annualSalary = parseFloat(document.getElementById("annualSalary").value) || 0;
  const bonus = parseFloat(document.getElementById("bonus").value) || 0;
  const extraDeductions = parseFloat(document.getElementById("extraDeductions").value) || 0;
  const state = document.getElementById("state").value;

  const health = document.getElementById("healthIns").checked ? 150 : 0;
  const dental = document.getElementById("dentalIns").checked ? 25 : 0;
  const vision = document.getElementById("visionIns").checked ? 10 : 0;
  const fsa = parseFloat(document.getElementById("fsaAmount").value) || 0;

  const companyName = document.getElementById("companyName").value;
  const companyInfo = document.getElementById("companyInfo").value;

  const federalTax = calcFederalTax(annualSalary);
  const stateTax = calcStateTax(state, annualSalary);

  const gross = annualSalary + bonus;
  const totalDeductions = federalTax + stateTax + extraDeductions + health + dental + vision + fsa;
  const net = gross - totalDeductions;

  document.getElementById("empNameDisplay").textContent = empName;
  document.getElementById("empPositionDisplay").textContent = empPosition;
  document.getElementById("empDeptDisplay").textContent = empDept;
  document.getElementById("empIdDisplay").textContent = empId;
  document.getElementById("empLocationDisplay").textContent = empLocation;
  document.getElementById("empAcctDisplay").textContent = empAcct;
  document.getElementById("payPeriodDisplay").textContent = payPeriod;
  document.getElementById("payDateDisplay").textContent = payDate;

  document.getElementById("companyNameDisplay").textContent = companyName;
  document.getElementById("companyInfoDisplay").textContent = companyInfo;

  const logoFile = document.getElementById("companyLogo").files[0];
  if (logoFile) {
    document.getElementById("companyLogoDisplay").src = URL.createObjectURL(logoFile);
  }

  document.getElementById("earningsTable").innerHTML = `
    <tr><td>Base Salary</td><td>—</td><td>—</td><td>$${annualSalary.toFixed(2)}</td></tr>
    <tr><td>Bonus</td><td>—</td><td>—</td><td>$${bonus.toFixed(2)}</td></tr>
    <tr><td><strong>Total Gross Pay</strong></td><td>—</td><td>—</td><td><strong>$${gross.toFixed(2)}</strong></td></tr>
  `;

  document.getElementById("deductionsTable").innerHTML = `
    <tr><td>Federal Tax</td><td>$${federalTax.toFixed(2)}</td></tr>
    <tr><td>State Tax</td><td>$${stateTax.toFixed(2)}</td></tr>
    <tr><td>Health Insurance</td><td>$${health.toFixed(2)}</td></tr>
    <tr><td>Dental Insurance</td><td>$${dental.toFixed(2)}</td></tr>
    <tr><td>Vision Insurance</td><td>$${vision.toFixed(2)}</td></tr>
    <tr><td>FSA Contribution</td><td>$${fsa.toFixed(2)}</td></tr>
    <tr><td>Other Deductions</td><td>$${extraDeductions.toFixed(2)}</td></tr>
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
