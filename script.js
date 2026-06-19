// ============================================================
//  CẤU HÌNH: dán URL Google Apps Script Web App vào đây
//  (xem hướng dẫn deploy trong README.md). Để trống "" thì
//  form sẽ chỉ lưu tạm trong trình duyệt (chế độ thử nghiệm).
// ============================================================
const FORM_ENDPOINT = "";

const form = document.querySelector("#leadForm");
const statusEl = document.querySelector("#formStatus");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;
const domainGrid = document.querySelector("#domainGrid");
const domainFilters = document.querySelector("#domainFilters");
const categorySelect = form ? form.querySelector("[name='category']") : null;

const domainGroupLabels = {
  office: { tag: "B2B", category: "Thiết bị văn phòng" },
  tech: { tag: "Ecommerce", category: "Linh kiện máy tính" },
  service: { tag: "Dịch vụ", category: "Dịch vụ sửa chữa" }
};

// status: "available" (còn trống) | "sold" (đã bán)
const domains = [
  {
    group: "office",
    name: "thietbivanphong.vn",
    desc: "Phù hợp landing page máy in, máy photocopy và thiết bị văn phòng.",
    price: "12.000.000đ",
    status: "available"
  },
  {
    group: "office",
    name: "mayphotocopycu.vn",
    desc: "Tập trung vào nhu cầu mua, thuê và bảo trì máy photocopy.",
    price: "8.500.000đ",
    status: "available"
  },
  {
    group: "office",
    name: "vanphong247.vn",
    desc: "Dễ triển khai trang dịch vụ hoặc trang thu lead cho khách doanh nghiệp.",
    price: "15.000.000đ",
    status: "sold"
  },
  {
    group: "tech",
    name: "linhkienmaytinh.vn",
    desc: "Phù hợp danh mục linh kiện, phụ kiện và máy tính văn phòng.",
    price: "18.000.000đ",
    status: "available"
  },
  {
    group: "tech",
    name: "phukienpc.vn",
    desc: "Ngắn gọn, dễ nhớ, dùng tốt cho landing page sản phẩm công nghệ.",
    price: "9.000.000đ",
    status: "available"
  },
  {
    group: "tech",
    name: "thitruongmaytinh.vn",
    desc: "Phù hợp website vệ tinh, tin tức hoặc trang bán hàng ngách.",
    price: "11.000.000đ",
    status: "available"
  },
  {
    group: "service",
    name: "suachuamayvanphong.vn",
    desc: "Phù hợp trang nhận báo giá sửa chữa và bảo trì thiết bị.",
    price: "7.500.000đ",
    status: "available"
  },
  {
    group: "service",
    name: "baotrimayin.vn",
    desc: "Tập trung dịch vụ bảo trì máy in cho công ty, văn phòng.",
    price: "6.000.000đ",
    status: "available"
  },
  {
    group: "service",
    name: "dichvukythuat.vn",
    desc: "Có thể mở rộng cho nhiều nhóm dịch vụ kỹ thuật khác nhau.",
    price: "10.000.000đ",
    status: "available"
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderDomains(filter = "all") {
  if (!domainGrid) {
    return;
  }

  const list = filter === "all" ? domains : domains.filter((item) => item.group === filter);

  domainGrid.innerHTML = list
    .map((item) => {
      const meta = domainGroupLabels[item.group] || {};
      const sold = item.status === "sold";
      const name = escapeHtml(item.name);
      const statusBadge = sold
        ? `<span class="status status-sold">Đã bán</span>`
        : `<span class="status status-available">Còn trống</span>`;
      const cta = sold
        ? `<button class="domain-cta" type="button" disabled aria-label="${name} đã bán">Đã bán</button>`
        : `<button class="domain-cta" type="button" data-domain="${name}" data-category="${escapeHtml(meta.category || "")}" aria-label="Liên hệ tư vấn về ${name}">
            Liên hệ tư vấn
            <span aria-hidden="true">&rarr;</span>
          </button>`;

      return `
        <article class="domain-card${sold ? " is-sold" : ""}">
          <div class="domain-card-top">
            <span class="tag">${escapeHtml(meta.tag || "")}</span>
            ${statusBadge}
          </div>
          <h3>${name}</h3>
          <p>${escapeHtml(item.desc)}</p>
          <div class="domain-card-foot">
            <span class="price">${escapeHtml(item.price || "Liên hệ")}</span>
            ${cta}
          </div>
        </article>
      `;
    })
    .join("");
}

function jumpToContact(domainName, category) {
  if (categorySelect && category) {
    const hasOption = Array.from(categorySelect.options).some((opt) => opt.value === category || opt.text === category);
    if (hasOption) {
      categorySelect.value = category;
    }
  }

  const messageField = form ? form.querySelector("[name='message']") : null;
  if (messageField && domainName && !messageField.value.trim()) {
    messageField.value = `Tôi quan tâm domain ${domainName}.`;
  }

  const contact = document.querySelector("#contact");
  if (contact) {
    contact.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const nameField = form ? form.querySelector("[name='name']") : null;
  if (nameField) {
    window.setTimeout(() => nameField.focus({ preventScroll: true }), 500);
  }
}

if (domainGrid) {
  domainGrid.addEventListener("click", (event) => {
    const cta = event.target.closest(".domain-cta");
    if (!cta || cta.disabled) {
      return;
    }
    jumpToContact(cta.dataset.domain, cta.dataset.category);
  });
}

if (domainFilters) {
  domainFilters.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) {
      return;
    }

    domainFilters.querySelectorAll(".chip").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });

    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    renderDomains(chip.dataset.filter);
  });
}

renderDomains("all");

// ------------------------------------------------------------
//  Form thu lead
// ------------------------------------------------------------
function getLeadPayload(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    createdAt: new Date().toISOString(),
    source: window.location.href
  };
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`;
}

// Backup phòng khi gửi mạng lỗi: lưu tạm trong trình duyệt.
function backupLeadLocally(payload) {
  try {
    const leads = JSON.parse(localStorage.getItem("domainLandingLeads") || "[]");
    leads.push(payload);
    localStorage.setItem("domainLandingLeads", JSON.stringify(leads));
  } catch (err) {
    // localStorage có thể bị chặn (chế độ ẩn danh) — bỏ qua, không chặn luồng gửi.
  }
}

async function sendLead(payload) {
  // Apps Script Web App: dùng text/plain để tránh CORS preflight.
  await fetch(FORM_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
}

function setSubmitting(isSubmitting) {
  if (!submitBtn) {
    return;
  }
  submitBtn.disabled = isSubmitting;
  submitBtn.textContent = isSubmitting ? "Đang gửi..." : "Gửi thông tin";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = getLeadPayload(new FormData(form));

  if (!payload.name || !payload.category) {
    setStatus("Vui lòng nhập họ tên và ngành hàng quan tâm.", "error");
    return;
  }

  if (!payload.email && !payload.phone) {
    setStatus("Vui lòng nhập ít nhất email hoặc số điện thoại.", "error");
    return;
  }

  if (payload.email && !isValidEmail(payload.email)) {
    setStatus("Email chưa đúng định dạng, vui lòng kiểm tra lại.", "error");
    return;
  }

  backupLeadLocally(payload);

  // Chưa cấu hình endpoint: chạy ở chế độ thử nghiệm (chỉ lưu tạm).
  if (!FORM_ENDPOINT) {
    form.reset();
    setStatus("Đã ghi nhận (chế độ thử nghiệm). Cấu hình Google Sheet để nhận lead thật.", "success");
    return;
  }

  setSubmitting(true);
  setStatus("Đang gửi thông tin...", "");

  try {
    await sendLead(payload);
    form.reset();
    setStatus("Đã nhận thông tin. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.", "success");
  } catch (err) {
    setStatus("Gửi chưa thành công. Vui lòng thử lại hoặc liên hệ trực tiếp qua số điện thoại/Zalo.", "error");
  } finally {
    setSubmitting(false);
  }
});
