export default ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative h-dvh w-full overflow-x-hidden overflow-y-auto p-4">
			{children}
		</div>
	);
};
