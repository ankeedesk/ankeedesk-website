import type { GatsbyNode } from "gatsby"

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  stage,
}) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /three/,
            use: "null-loader",
          },
          {
            test: /@react-three/,
            use: "null-loader",
          },
        ],
      },
    })
  }
}
