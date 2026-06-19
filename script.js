// ============================================================
//  CẤU HÌNH: dán URL Google Apps Script Web App vào đây
//  (xem hướng dẫn deploy trong README.md). Để trống "" thì
//  form sẽ chỉ lưu tạm trong trình duyệt (chế độ thử nghiệm).
// ============================================================
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwfID1Jsuit58QG27F3nn9_YD1olduLDtfYoEO2sg-0ylYRcuZ7aXRjfJYxk6s8hIk/exec";

const form = document.querySelector("#leadForm");
const statusEl = document.querySelector("#formStatus");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;
const domainName = form ? (form.dataset.domain || "") : "";

// ------------------------------------------------------------
//  Popup form (chỉ dùng trên bản mobile)
// ------------------------------------------------------------
const openFormBtn = document.querySelector("#openForm");
const closeFormBtn = document.querySelector("#closeForm");
const formBackdrop = document.querySelector("#formBackdrop");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function openFormModal() {
  document.body.classList.remove("form-closing");
  if (formBackdrop) {
    formBackdrop.classList.remove("is-closing");
    formBackdrop.hidden = false;
  }
  document.body.classList.add("form-open");
  const nameField = form ? form.querySelector("[name='name']") : null;
  if (nameField) {
    window.setTimeout(() => nameField.focus({ preventScroll: true }), 50);
  }
}

function finalizeClose() {
  document.body.classList.remove("form-open", "form-closing");
  if (formBackdrop) {
    formBackdrop.hidden = true;
    formBackdrop.classList.remove("is-closing");
  }
}

function closeFormModal() {
  if (!document.body.classList.contains("form-open")) {
    return;
  }

  // Giảm chuyển động hoặc không có form: đóng ngay.
  if (prefersReducedMotion() || !form) {
    finalizeClose();
    return;
  }

  document.body.classList.add("form-closing");
  if (formBackdrop) {
    formBackdrop.classList.add("is-closing");
  }

  const onEnd = (event) => {
    if (event.target !== form) {
      return;
    }
    form.removeEventListener("animationend", onEnd);
    // Bỏ qua nếu người dùng đã mở lại trong lúc đang đóng.
    if (document.body.classList.contains("form-closing")) {
      finalizeClose();
    }
  };
  form.addEventListener("animationend", onEnd);
}

if (openFormBtn) {
  openFormBtn.addEventListener("click", openFormModal);
}
if (closeFormBtn) {
  closeFormBtn.addEventListener("click", closeFormModal);
}
if (formBackdrop) {
  formBackdrop.addEventListener("click", closeFormModal);
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFormModal();
  }
});

function getLeadPayload(formData) {
  return {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    category: domainName, // ghi lại tên miền của lead vào cột "category"
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

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = getLeadPayload(new FormData(form));

    if (!payload.name) {
      setStatus("Vui lòng nhập họ tên.", "error");
      return;
    }

    if (!payload.email && !payload.phone) {
      setStatus("Vui lòng nhập ít nhất số điện thoại hoặc email.", "error");
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
}
