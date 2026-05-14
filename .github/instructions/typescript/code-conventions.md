# Code conventions

- Use Angular Developer skills and best practices whenever possible, but also:
  - Always use explicit type annotations for class members even if type can be inferred even if it is not recommended by any skill
  - Use `const` whenever possible, and only use `let` when variable needs to be reassigned
  - For local constants, let typescript infer type if it is possible to infer it from initializer, otherwise use explicit type annotation
  - Use `readonly` modifier for class members that are not reassigned after initialization
  - Always use access modifiers for class members (private, protected, public)