const N = 4;
let step = 1;

const examplesEl = document.getElementById('examples');
const button = document.getElementById('submitBtn');

let currentInput = null;

createExample(step);

function createExample(step) {
  const row = document.createElement('div');
  row.className = 'example-row';

  const left = document.createElement('div');
  left.className = 'example-left';
  left.innerHTML = `${N} × ${step} = `;

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'example__input';

  left.appendChild(input);
  row.appendChild(left);

  const right = document.createElement('div');
  right.className = 'example-right';
  row.appendChild(right);

  examplesEl.appendChild(row);
  currentInput = input;

  input.addEventListener('input', () => {
    button.disabled = input.value === '';
  });

  for (let i = 0; i < N; i++) {
    const cube = document.createElement('div');
    cube.className = 'cube';
    right.appendChild(cube);
  }
}

button.addEventListener('click', () => {
  const answer = Number(currentInput.value);
  if (answer === N * step) {
    currentInput.disabled = true;
    step++;
    createExample(step);
  }
});
