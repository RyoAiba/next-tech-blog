import ContactForm from "./ContactForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-10 py-6 md:py-10 prose prose-zinc prose-sm md:prose-base leading-relaxed">
      {/* パンくず */}
      <Breadcrumb
        items={[
          { label: "Usagi Blog", href: "/" },
          { label: "お問い合わせフォーム" },
        ]}
      />
      <h1 className="text-2xl md:text-3xl mb-6">お問い合わせフォーム</h1>
      <ContactForm />
    </main>
  );
}