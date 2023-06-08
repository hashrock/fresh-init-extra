import prompts from "npm:prompts";

const FRAMEWORKS = [
  {
    name: "react",
    display: "React",
    color: (text: string) => `\u001b[36m${text}\u001b[0m`,
  },
  {
    name: "vue",
    display: "Vue",
    color: (text: string) => `\u001b[32m${text}\u001b[0m`,
  },
  {
    name: "angular",
    display: "Angular",
    color: (text: string) => `\u001b[31m${text}\u001b[0m`,
  },
];

const result = await prompts({
  type: "select",
  name: "framework",
  message: "Select a framework:",
  initial: 0,
  choices: FRAMEWORKS.map((framework) => {
    const frameworkColor = framework.color;
    return {
      title: frameworkColor(framework.display || framework.name),
      value: framework,
    };
  }),
});

console.log(result);
