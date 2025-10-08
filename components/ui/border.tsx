export function Border() {
  return (
    <>
      <div className="bg-foreground dark:bg-ring absolute -top-1.5 left-1.5 h-1.5 w-1/2" />
      <div className="bg-foreground dark:bg-ring absolute -top-1.5 right-1.5 h-1.5 w-1/2" />
      <div className="bg-foreground dark:bg-ring absolute -bottom-1.5 left-1.5 h-1.5 w-1/2" />
      <div className="bg-foreground dark:bg-ring absolute right-1.5 -bottom-1.5 h-1.5 w-1/2" />
      <div className="bg-foreground dark:bg-ring absolute top-0 left-0 size-1.5" />
      <div className="bg-foreground dark:bg-ring absolute top-0 right-0 size-1.5" />
      <div className="bg-foreground dark:bg-ring absolute bottom-0 left-0 size-1.5" />
      <div className="bg-foreground dark:bg-ring absolute right-0 bottom-0 size-1.5" />
      <div className="bg-foreground dark:bg-ring absolute top-1.5 -left-1.5 h-[calc(100%-12px)] w-1.5" />
      <div className="bg-foreground dark:bg-ring absolute top-1.5 -right-1.5 h-[calc(100%-12px)] w-1.5" />
    </>
  );
}
