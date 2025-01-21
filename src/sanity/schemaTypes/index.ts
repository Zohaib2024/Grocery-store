import { type SchemaTypeDefinition } from "sanity";
import { product } from "../product";
import { category } from "../category";
import { slider } from "../slider";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, slider],
};
