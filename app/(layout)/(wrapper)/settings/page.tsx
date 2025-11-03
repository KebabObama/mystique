import Email from "@/components/settings/email";
import Name from "@/components/settings/name";

export default () => {
	return (
		<div className="flex flex-row gap-6">
			<div className="flex flex-col gap-6">
				<span>Name: </span>
				<Name />
			</div>
			<div className="flex flex-col gap-6">
				<span>Email: </span>
				<Email />
			</div>
		</div>
	);
};
