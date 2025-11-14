import { CharacterCreator } from "@/components/creators/character/character-creator";
import { Button } from "@/components/ui/button";

export default () => {
	return (
		<CharacterCreator asChild>
			<Button>Create Character</Button>
		</CharacterCreator>
	);
};
