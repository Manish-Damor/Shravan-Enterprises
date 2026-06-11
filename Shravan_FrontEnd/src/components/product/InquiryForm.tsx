import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitPublicEnquiry } from "@/lib/catalog";
import type { NormalizedProduct } from "@/lib/product-normalizer";

export default function InquiryForm({
  product,
}: {
  product: NormalizedProduct;
}) {
  const queryClient = useQueryClient();
  const defaultMessage = `Interested in ${product.name}`;

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMessage(defaultMessage);
    setErrors({});
  }, [defaultMessage]);

  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof submitPublicEnquiry>[0]) =>
      submitPublicEnquiry(input),
    onSuccess: () => {
      toast.success("Inquiry sent - we'll get back to you soon.");
      queryClient.invalidateQueries({ queryKey: ["public-catalog"] });
      setName("");
      setCompany("");
      setPhone("");
      setEmail("");
      setMessage(defaultMessage);
      setErrors({});
    },
    onError: (error: Error & { payload?: { errors?: Record<string, string> } }) => {
      const payloadErrors = error.payload?.errors;
      if (payloadErrors) {
        setErrors(payloadErrors);
        const firstError = Object.values(payloadErrors)[0];
        if (firstError) toast.error(firstError);
        return;
      }

      toast.error(error.message || "Unable to send inquiry");
    },
  });

  function validateFields() {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.customer_name = "Please enter your name";
    else if (name.trim().length < 2) nextErrors.customer_name = "Name is too short";

    if (!phone.trim()) nextErrors.mobile = "Please enter your phone number";
    else {
      const digits = phone.replace(/[^0-9+]/g, "");
      if (!/^\+?[0-9]{6,}$/.test(digits)) {
        nextErrors.mobile = "Please enter a valid phone number";
      }
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!message.trim()) nextErrors.message = "Please enter a short message";
    else if (message.trim().length < 10) {
      nextErrors.message = "Message is too short (min 10 chars)";
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0]);
      return;
    }

    setErrors({});

    mutation.mutate({
      customer_name: name.trim(),
      company: company.trim() || undefined,
      mobile: phone.trim(),
      email: email.trim() || undefined,
      subject: `Product enquiry: ${product.name}`,
      message: message.trim(),
      product_id: product.id ?? undefined,
      category_id: product.category_id ?? undefined,
    });
  }

  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-card">
      <h4 className="text-lg font-semibold text-foreground">Quick Inquiry</h4>
      <p className="mt-1 text-sm text-muted-foreground">
        Share your requirement and our team will respond on phone or email.
      </p>
      <form
        className="mt-3 space-y-3"
        onSubmit={handleSubmit}
        aria-labelledby="inquiry-title"
      >
        <label htmlFor="inq-name" className="sr-only">
          Name
        </label>
        <input
          id="inq-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          aria-invalid={Boolean(errors.customer_name)}
          aria-describedby={errors.customer_name ? "err-name" : undefined}
          className="w-full rounded-xl border border-border bg-secondary/35 px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
        />
        {errors.customer_name ? (
          <div id="err-name" className="mt-1 text-sm text-rose-500">
            {errors.customer_name}
          </div>
        ) : null}

        <label htmlFor="inq-company" className="sr-only">
          Company
        </label>
        <input
          id="inq-company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Company"
          className="w-full rounded-xl border border-border bg-secondary/35 px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
        />

        <label htmlFor="inq-phone" className="sr-only">
          Phone
        </label>
        <input
          id="inq-phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone"
          aria-invalid={Boolean(errors.mobile)}
          aria-describedby={errors.mobile ? "err-phone" : undefined}
          className="w-full rounded-xl border border-border bg-secondary/35 px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
        />
        {errors.mobile ? (
          <div id="err-phone" className="mt-1 text-sm text-rose-500">
            {errors.mobile}
          </div>
        ) : null}

        <label htmlFor="inq-email" className="sr-only">
          Email (optional)
        </label>
        <input
          id="inq-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email (optional)"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "err-email" : undefined}
          className="w-full rounded-xl border border-border bg-secondary/35 px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
        />
        {errors.email ? (
          <div id="err-email" className="mt-1 text-sm text-rose-500">
            {errors.email}
          </div>
        ) : null}

        <label htmlFor="inq-message" className="sr-only">
          Message
        </label>
        <textarea
          id="inq-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={defaultMessage}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "err-message" : undefined}
          className="w-full min-h-28 rounded-xl border border-border bg-secondary/35 px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/35"
        />
        {errors.message ? (
          <div id="err-message" className="mt-1 text-sm text-rose-500">
            {errors.message}
          </div>
        ) : null}

        <button
          disabled={mutation.isPending}
          aria-busy={mutation.isPending}
          className="w-full rounded bg-amber-500 py-2 font-semibold text-black"
        >
          {mutation.isPending ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
