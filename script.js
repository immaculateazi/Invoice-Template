// Simple invoice template JS: add/remove rows, calculations, sample data
document.addEventListener('DOMContentLoaded', () => {
  const itemsBody = document.getElementById('itemsBody');
  const addItemBtn = document.getElementById('addItemBtn');
  const printBtn = document.getElementById('printBtn');

  const subtotalEl = document.getElementById('subtotal');
  const totalTaxEl = document.getElementById('totalTax');
  const grandTotalEl = document.getElementById('grandTotal');

  // initialize date fields and sample invoice number
  const invoiceDate = document.getElementById('invoiceDate');
  const dueDate = document.getElementById('dueDate');
  invoiceDate.valueAsDate = new Date();
  const dd = new Date();
  dd.setDate(dd.getDate() + 14);
  dueDate.valueAsDate = dd;

  // sample initial items
  const sampleItems = [
    { desc: 'Landing page from Figma', qty: 1, unit: 120, tax: 0 },
    { desc: 'Minor revisions & responsive tweaks', qty: 2, unit: 25, tax: 0 }
  ];

  function currency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  }

  function createRow(item = {desc:'', qty:1, unit:0, tax:0}) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><input type="text" class="desc" value="${escapeHtml(item.desc)}" /></td>
      <td><input type="number" class="qty" min="0" value="${item.qty}" /></td>
      <td><input type="number" class="unit" min="0" step="0.01" value="${item.unit}" /></td>
      <td><input type="number" class="tax" min="0" step="0.01" value="${item.tax}" /></td>
      <td class="lineTotal">${currency(item.qty * item.unit * (1 + item.tax/100))}</td>
      <td><button class="removeBtn" title="Remove">✕</button></td>
    `;

    // event listeners for inputs
    tr.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => updateTotals());
    });

    tr.querySelector('.removeBtn').addEventListener('click', () => {
      tr.remove();
      updateTotals();
    });

    itemsBody.appendChild(tr);
    return tr;
  }

  function updateTotals() {
    const rows = [...itemsBody.querySelectorAll('tr')];
    let subtotal = 0, totalTax = 0;
    rows.forEach(r => {
      const qty = parseFloat(r.querySelector('.qty').value) || 0;
      const unit = parseFloat(r.querySelector('.unit').value) || 0;
      const tax = parseFloat(r.querySelector('.tax').value) || 0;

      const lineNet = qty * unit;
      const lineTax = lineNet * (tax / 100);
      const lineTotal = lineNet + lineTax;

      r.querySelector('.lineTotal').textContent = currency(lineTotal);

      subtotal += lineNet;
      totalTax += lineTax;
    });

    subtotalEl.textContent = currency(subtotal);
    totalTaxEl.textContent = currency(totalTax);
    grandTotalEl.textContent = currency(subtotal + totalTax);
  }

  // escape to avoid breaking inputs (basic)
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // initial populate
  sampleItems.forEach(i => createRow(i));
  updateTotals();

  addItemBtn.addEventListener('click', () => {
    createRow({desc:'New item', qty:1, unit:0, tax:0});
    updateTotals();
  });

  printBtn.addEventListener('click', () => {
    // hide editing outlines for print (optional)
    window.print();
  });

  // nice small UX: press Enter in description to add new row
  itemsBody.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createRow({desc:'New item', qty:1, unit:0, tax:0});
    }
  });
});