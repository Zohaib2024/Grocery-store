import { defineType } from "sanity";

export const slider = defineType({
  name: "Slider",
  title: "Slider",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },

    {
      name: "Image",
      type: "image",

      title: "Image",
    },
  ],
});
