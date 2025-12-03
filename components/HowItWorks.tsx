export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create",
      description: "Enter business details. Add products. 5 minutes.",
    },
    {
      number: "2",
      title: "Share",
      description: "One link for Instagram, WhatsApp, everywhere.",
    },
    {
      number: "3",
      title: "Sell",
      description: "Customers chat or order. You get paid.",
    },
  ];
  return (
    <section className="bg-gray-50 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Three steps to selling on WhatsApp
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.number}
              className="rounded-2xl bg-white p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                {s.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-3 text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
