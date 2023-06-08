export default function island(name: string) {
  return `import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface ${name}Props {
  start: number;
}

export default function ${name}(props: ${name}Props) {
  const count = useSignal(props.start);
  return (
    <div>
      <button
        onClick={() => count.value -= 1}
        disabled={!IS_BROWSER || count.value <= 0}
      >
        -
      </button>
      <div>{count}</div>
      <button
        onClick={() => count.value += 1}
        disabled={!IS_BROWSER}
      >
        +
      </button>
    </div>
  );
}`;
}
