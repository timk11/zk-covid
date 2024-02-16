import circuit from '../zk_model/target/zk_model.json';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

const setup = async () => {
  await Promise.all([
    import("@noir-lang/noirc_abi").then(module => 
      module.default(new URL("@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm", import.meta.url).toString())
    ),
    import("@noir-lang/acvm_js").then(module => 
      module.default(new URL("@noir-lang/acvm_js/web/acvm_js_bg.wasm", import.meta.url).toString())
    )
  ]);
}

function display(container, msg) {
  const c = document.getElementById(container);
  const p = document.createElement('p');
  p.textContent = msg;
  c.appendChild(p);
}

document.getElementById('submitGuess').addEventListener('click', async () => {
  try {
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend);
    const x = parseInt(document.getElementById('guessInput').value);
    const input = { x, y: 2 };
    await setup(); // let's squeeze our wasm inits here
    display('logs', 'Generating proof... ⌛');
    const proof = await noir.generateFinalProof(input);
    display('logs', 'Generating proof... ✅');
    display('results', proof.proof);
    display('logs', 'Verifying proof... ⌛');
    const verification = await noir.verifyFinalProof(proof);
    if (verification) display('logs', 'Verifying proof... ✅');
  } catch(err) {
    display("logs", "Oh 💔 Wrong guess")
  }
});
