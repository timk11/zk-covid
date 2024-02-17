import circuit from '../zk_model/target/zk_model.json';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

const axios = (await import("axios")).default;
const FormData = (await import("form-data")).default;
const fs = (await import("fs")).default;
const process = (await import("process")).default;
const tar = (await import("tar")).default;

const SINDRI_API_KEY = process.env.SINDRI_API_KEY;
const circuitId = process.env.CIRCUIT_ID;

axios.defaults.baseURL = "https://sindri.app/api/v1";
axios.defaults.headers.common["Authorization"] = `Bearer ${SINDRI_API_KEY}`;
axios.defaults.validateStatus = (status) => status >= 200 && status < 300;

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

    const inputArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    inputArray[0] = sex;
    inputArray[1] = Math.floor(age * 10000 / 90.374372);
    if (pneumonia == 1) {
      inputArray[2] = 10000;
    } else if (pneumonia == 2) {
      inputArray[3] = 10000;
    } else {
      inputArray[4] = 10000;
    }
    if (pregnant == 1) {
      inputArray[5] = 10000;
    } else if (pregnant == 2) {
      inputArray[6] = 10000;
    } else {
      inputArray[7] = 10000;
    }
    if (diabetes == 1) {
      inputArray[8] = 10000;
    } else if (diabetes == 2) {
      inputArray[9] = 10000;
    } else {
      inputArray[10] = 10000;
    }
    if (copd == 1) {
      inputArray[11] = 10000;
    } else if (copd == 2) {
      inputArray[12] = 10000;
    } else {
      inputArray[13] = 10000;
    }
    if (asthma == 1) {
      inputArray[14] = 10000;
    } else if (asthma == 2) {
      inputArray[15] = 10000;
    } else {
      inputArray[16] = 10000;
    }
    if (immsupr == 1) {
      inputArray[17] = 10000;
    } else if (immsupr == 2) {
      inputArray[18] = 10000;
    } else {
      inputArray[19] = 10000;
    }
    if (hypertension == 1) {
      inputArray[20] = 10000;
    } else if (hypertension == 2) {
      inputArray[21] = 10000;
    } else {
      inputArray[22] = 10000;
    }
    if (other == 1) {
      inputArray[23] = 10000;
    } else if (other == 2) {
      inputArray[24] = 10000;
    } else {
      inputArray[25] = 10000;
    }
    if (cardiovasc == 1) {
      inputArray[26] = 10000;
    } else if (cardiovasc == 2) {
      inputArray[27] = 10000;
    } else {
      inputArray[28] = 10000;
    }
    if (obese == 1) {
      inputArray[29] = 10000;
    } else if (obese == 2) {
      inputArray[30] = 10000;
    } else {
      inputArray[31] = 10000;
    }
    if (renal == 1) {
      inputArray[32] = 10000;
    } else if (renal == 2) {
      inputArray[33] = 10000;
    } else {
      inputArray[34] = 10000;
    }
    if (tobacco == 1) {
      inputArray[35] = 10000;
    } else if (tobacco == 2) {
      inputArray[36] = 10000;
    } else {
      inputArray[37] = 10000;
    }

    const inputMap = { input: inputArray };
    await setup();
    document.getElementById('score').innerText = 'Generating result... ⌛';
    const result = await noir.execute(inputMap);
    document.getElementById('score').innerText = 'Raw Score: ' + (result[0] / 10000000000000000).toString();
    if (result[0] < 1200000000000000) {
      document.getElementById('results').innerText = 'Unspecified risk - Refer to local clinical guidelines';
    } else {
      document.getElementById('results').innerText = 'HIGH RISK';
    }
    document.getElementById('proof').innerText = 'Generating proof... ⌛';
    
    // get proof method from compile.mjs
    const proofInput = `input = ${inputArray}`;
    const proveResponse = await axios.post(`/circuit/${circuitId}/prove`, {
      proof_input: proofInput,
    });
    const proofId = proveResponse.data.proof_id;
    document.getElementById('proof').innerText = `Proof ID: ${proofId}`;
    startTime = Date.now();
    let proofDetailResponse;
    while (true) {
      proofDetailResponse = await axios.get(`/proof/${proofId}/detail`);
      const { status } = proofDetailResponse.data;
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
      if (status === "Ready") {
        document.getElementById('proof').innerText = `Polling succeeded after ${elapsedSeconds} seconds.`;
        break;
      } else if (status === "Failed") {
        throw new Error(
          `Polling failed after ${elapsedSeconds} seconds: ${proofDetailResponse.data.error}.`,
        );
      } else if (Date.now() - startTime > 30 * 60 * 1000) {
        throw new Error("Timed out after 30 minutes.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    document.getElementById('proof2').innerText = `\nProof Output:\n${proofDetailResponse.data.proof}\n\nPublic Output:\n${proofDetailResponse.data.public}`;

    document.getElementById('verify').innerText = 'Verifying proof... ⌛';
    const verification = await noir.verifyFinalProof(proof);
    if (verification) document.getElementById('verify').innerText = 'Verifying proof... ✅';
  } catch(err) {
    document.getElementById('verify').innerText = "Proof failed";
  }
});
