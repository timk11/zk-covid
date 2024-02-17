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

document.getElementById('submitForm').addEventListener('submit', async () => {
  try {
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend);
    const sex = parseInt(document.getElementById('sex').value);
    const pneumonia = parseInt(document.getElementById('pneumonia').value);
    const age = parseInt(document.getElementById('age').value);
    const pregnant = parseInt(document.getElementById('pregnant').value);
    const diabetes = parseInt(document.getElementById('diabetes').value);
    const copd = parseInt(document.getElementById('copd').value);
    const asthma = parseInt(document.getElementById('asthma').value);
    const immsupr = parseInt(document.getElementById('immsupr').value);
    const hypertension = parseInt(document.getElementById('hypertension').value);
    const other = parseInt(document.getElementById('other').value);
    const cardiovasc = parseInt(document.getElementById('cardiovasc').value);
    const obese = parseInt(document.getElementById('obese').value);
    const renal = parseInt(document.getElementById('renal').value);
    const tobacco = parseInt(document.getElementById('tobacco').value);
    // need to create input array
    const input = { x, y: 2 }; // change
    await setup();
    display('logs', 'Generating result... ⌛');
    const result = await noir.execute(input);
    display('logs', 'Generating result... ✅');
    display('results', result);
    // display "high risk" or "unspecified risk"
    display('logs', 'Generating proof... ⌛');
    // get proof method from compile.mjs
    const proof = await noir.generateFinalProof(input);
    display('logs', 'Generating proof... ✅');
    display('results', proof.proof);
    display('logs', 'Verifying proof... ⌛');
    const verification = await noir.verifyFinalProof(proof);
    if (verification) display('logs', 'Verifying proof... ✅');
  } catch(err) {
    display("logs", "Proof failed")
  }
});
