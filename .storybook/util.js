import { Description, DocsPage } from "@storybook/addon-docs/blocks";

/**
 * This transforms a component markdown to properly render in Storybook notes.
 */
export const parseReadme = (content) =>
  content
    // the generated readme includes escape characters which actually get rendered, remove them
    .replace(/ \\\| /g, " | ")

    // markdown uses relative paths for component links
    .replace(
      /\.\.\//g,
      "https://github.com/Esri/calcite-components/tree/master/src/components/"
    );

export const globalDocsPage = () => (
  /* <React.Fragment> */
  /* omit <Title /> as Description includes it (from component READMEs) */
  <Description />
  /* </React.Fragment> */
);
