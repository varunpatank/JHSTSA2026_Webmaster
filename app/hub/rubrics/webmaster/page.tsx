export default function WebmasterRubric() {
  const categories = [
    { name: 'Theme (X2)', max: 10 },
    { name: 'Challenge (X3)', max: 10 },
    { name: 'Content (X2)', max: 10 },
    { name: 'Layout & Navigation (X2)', max: 10 },
    { name: 'Graphics & Color Scheme (X2)', max: 10 },
    { name: 'Function & Compatibility (X1)', max: 10 },
    { name: 'Spelling & Grammar (X1)', max: 10 },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Webmaster Rubric — Exemplary (Max) Example</h1>
        <p className="text-neutral-600 mb-6">This example shows the maximum (exemplary) score for each rubric category so teams can aim for the highest possible rating.</p>

        <div className="card p-6 bg-white">
          <div className="grid gap-4">
            {categories.map((c) => (
              <div key={c.name} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-neutral-500">Exemplary performance — aim for clear, polished, and complete work.</div>
                </div>
                <div className="text-xl font-bold text-green-700">{c.max} / 10</div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 text-sm text-neutral-600">
            <strong>Preliminary Website (subtotal):</strong> {categories.reduce((sum, c) => sum + c.max, 0)} / 130
          </div>
        </div>

        <div className="mt-8 text-neutral-600 text-sm">
          <p>Use this as a checklist when preparing your Webmaster entry — each category should be fully addressed with strong evidence and polish.</p>
        </div>
      </div>
    </div>
  );
}
