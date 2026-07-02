export function AuthDivider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-dex-border" />
      </div>
      <div className="relative flex justify-center text-xs text-dex-muted">
        <span className="bg-dex-bg px-3 text-dex-muted">ou</span>
      </div>
    </div>
  );
}
