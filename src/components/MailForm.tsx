"use client";

import { type FormEvent } from "react";
import type { Ui } from "@/i18n/ui";

export function MailForm({ email, labels }: { email: string; labels: Ui["contact"] }) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim() || labels.defaultSubject;
    const message = String(data.get("message") ?? "").trim();
    const body = [`${labels.nameLine}: ${name || labels.missingName}`, "", message].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="mail" onSubmit={onSubmit}>
      <label>
        {labels.name}
        <input name="name" autoComplete="name" maxLength={80} />
      </label>
      <label>
        {labels.subject}
        <input name="subject" maxLength={120} placeholder={labels.placeholder} />
      </label>
      <label>
        {labels.message}
        <textarea name="message" required rows={6} maxLength={4000} />
      </label>
      <button type="submit">{labels.submit}</button>
      <p className="hint">{labels.hint}</p>
    </form>
  );
}
