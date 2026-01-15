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
  input.focus();

  button.disabled = true;
  button.className = '';

  input.addEventListener('input', () => {
    if (input.value !== '') {
      button.disabled = false;
      button.className = 'active';
    } else {
      button.disabled = true;
      button.className = '';
    }
  });

  for (let i = 0; i < N; i++) {
    const cube = document.createElement('div');
    cube.className = 'cube';
    document.body.appendChild(cube);

    const rect = right.getBoundingClientRect();
    const targetX = rect.left + i * (24 + 10);
    const targetY = rect.top;

    cube.style.left = `${targetX}px`;
    cube.style.top = `${window.innerHeight}px`;

    requestAnimationFrame(() => {
      cube.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      cube.style.transform = `translateY(${targetY - window.innerHeight}px)`;
      cube.style.opacity = '1';
    });

    cube.addEventListener('transitionend', () => {
      cube.style.transition = '';
      cube.style.transform = '';
      cube.style.position = 'relative';
      cube.style.left = '';
      cube.style.top = '';
      cube.style.opacity = '1';
      right.appendChild(cube);
    }, { once: true });
  }
}

button.addEventListener('click', () => {
  if (!currentInput) return;

  const answer = Number(currentInput.value);
  const correct = N * step;

  button.className = '';

  if (answer === correct) {
    button.classList.add('right');

    currentInput.blur();
    currentInput.disabled = true;
    currentInput.classList.add('input--answered');

    step++;
    createExample(step);
  } else {
    button.classList.add('wrong');
    currentInput.classList.add('wrong-input');
    setTimeout(() => {
      button.className = '';
      currentInput.classList.remove('wrong-input');
    }, 1000);
  }
});
