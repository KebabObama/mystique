export default ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative h-dvh w-full overflow-x-hidden overflow-y-auto px-6 py-4">
			{children}
		</div>
	);
};
