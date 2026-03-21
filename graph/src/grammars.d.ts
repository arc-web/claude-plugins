/**
 * Type declarations for tree-sitter grammar packages.
 *
 * The grammar packages (tree-sitter-typescript, tree-sitter-javascript)
 * declare their Language type with `language: unknown` to avoid a hard
 * dependency on tree-sitter's internal types. At runtime the objects ARE
 * fully compatible Parser.Language instances — the grammars just chose
 * not to couple their .d.ts to tree-sitter's.
 *
 * This file re-declares the modules with the correct types so imports
 * work seamlessly with Parser.setLanguage() — no casts needed anywhere.
 */

declare module "tree-sitter-typescript" {
  import Parser from "tree-sitter";
  export const typescript: Parser.Language;
  export const tsx: Parser.Language;
}

declare module "tree-sitter-javascript" {
  import Parser from "tree-sitter";
  const language: Parser.Language;
  export default language;
}
