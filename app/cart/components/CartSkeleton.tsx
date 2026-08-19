export default function CartSkeleton() {
  return (
    <main className="min-h-screen bg-[var(--background)] pb-40">
      <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4">
        <div className="mb-4 h-16 animate-pulse rounded-2xl bg-[var(--card-bg)]" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-2xl bg-[var(--card-bg)]"
                />
              )
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 h-44 animate-pulse rounded-2xl bg-[var(--card-bg)]" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 border-t border-[var(--nav-border)] bg-[var(--card-bg)] p-3 lg:hidden">
        <div className="mx-auto w-full max-w-6xl">
          <div className="h-20 animate-pulse rounded-2xl bg-[var(--card-secondary)]" />
        </div>
      </div>
    </main>
  );
}
