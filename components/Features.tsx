export default function Features() {
  const features = [
    {
      icon: "💬",
      title: "WhatsApp Chat",
      desc: "Click to chat, zero API complexity",
    },
    { icon: "📱", title: "Mobile First", desc: "Beautiful on every screen" },
    {
      icon: "💳",
      title: "Simple Orders",
      desc: "Forms customers actually use",
    },
    {
      icon: "📊",
      title: "Track Everything",
      desc: "See views, chats, and orders",
    },
  ];
  return (
    <section className="bg-white px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Built for Nigerian Businesses
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to sell on WhatsApp
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-gray-50 p-6 text-center"
            >
              <div className="text-5xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
