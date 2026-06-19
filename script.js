const form = document.querySelector("#leadForm");
const statusEl = document.querySelector("#formStatus");
const domainGrid = document.querySelector("#domainGrid");
const domainFilters = document.querySelector("#domainFilters");
const categorySelect = form ? form.querySelector("[name='category']") : null;

const domainGroupLabels = {
  office: { label: "Văn phòng", tag: "B2B", category: "Thiết bị văn phòng" },
  tech: { label: "Công nghệ", tag: "Ecommerce", category: "Linh kiện máy tính" },
  service: { label: "Dịch vụ", tag: "Dịch vụ", category: "Dịch vụ sửa chữa" }
};

const domains = [
  {
    group: "office",
    name: "thietbivanphong.vn",
    desc: "Phù hợp landing page máy in, máy photocopy và thiết bị văn phòng."
  },
  {
    group: "office",
    name: "mayphotocopycu.vn",
    desc: "Tập trung vào nhu cầu mua, thuê và bảo trì máy photocopy."
  },
  {
    group: "office",
    name: "vanphong247.vn",
    desc: "Dễ triển khai trang dịch vụ hoặc trang thu lead cho khách doanh nghiệp."
  },
  {
    group: "tech",
    name: "linhkienmaytinh.vn",
    desc: "Phù hợp danh mục linh kiện, phụ kiện và máy tính văn phòng."
  },
  {
    group: "tech",
    name: "phukienpc.vn",
    desc: "Ngắn gọn, dễ nhớ, dùng tốt cho landing page sản phẩm công nghệ."
  },
  {
    group: "tech",
    name: "thitruongmaytinh.vn",
    desc: "Phù hợp website vệ tinh, tin tức hoặc trang bán hàng ngách."
  },
  {
    group: "service",
    name: "suachuamayvanphong.vn",
    desc: "Phù hợp trang nhận báo giá sửa chữa và bảo trì thiết bị."
  },
  {
    group: "service",
    name: "baotrimayin.vn",
    desc: "Tập trung dịch vụ bảo trì máy in cho công ty, văn phòng."
  },
  {
    group: "service",
    name: "dichvukythuat.vn",
    desc: "Có thể mở rộng cho nhiều nhóm dịch vụ kỹ thuật khác nhau."
  }
];

function renderDomains(filter = "all") {
  if (!domainGrid) {
    return;
  }

  const list = filter === "all" ? domains : domains.filter((item) => item.group === filter);

  domainGrid.innerHTML = list
    .map((item) => {
      const meta = domainGroupLabels[item.group] || {};
      return `
        <article class="domain-card">
          <span class="tag">${meta.tag || ""}</span>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <button class="domain-cta" type="button" data-domain="${item.name}" data-category="${meta.category || ""}">
            Liên hệ tư vấn
            <span aria-hidden="true">&rarr;</span>
          </button>
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
    if (!cta) {
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

function getLeadPayload(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    message: String(formData.get("message") || "").trim(),
    createdAt: new Date().toISOString()
  };
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status ${type}`;
}

form.addEventListener("submit", (event) => {
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

  const leads = JSON.parse(localStorage.getItem("domainLandingLeads") || "[]");
  leads.push(payload);
  localStorage.setItem("domainLandingLeads", JSON.stringify(leads));

  form.reset();
  setStatus("Đã nhận thông tin. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.", "success");
});
