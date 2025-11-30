export type Match = string | string[] | RegExp;

export interface MatcherOptions {
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

export const matcher = (pattern: Match = "*", input: string, options: MatcherOptions = {}): boolean => {
  const { caseSensitive = false, exactMatch = false } = options;
  if (Array.isArray(pattern)) return pattern.some((p) => matcher(p, input, options));
  if (pattern instanceof RegExp) return pattern.test(input);
  if (pattern === "*") return true;
  if (exactMatch) return caseSensitive ? pattern === input : pattern.toLowerCase() === input.toLowerCase();
  const regex = new RegExp(
    `^${pattern
      .split("*")
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join(".*")}$`,
    caseSensitive ? "" : "i"
  );
  return regex.test(input);
};
