// utill
function $(selector) { return document.querySelector(selector) }
function $$(selector) { return document.querySelectorAll(selector) }
// chart
async function chart() {
  // utill
  const tableTemplate = (title, content) => `
  <li class="column fd-c ali-c btn-2 gp-5">
    <h3>${title}</h3>
    <p>${content}</p>
  </li>`;
  const chartTemplate = ($time, $value) => `
  <div title="${$time}" class="fit c-6 juc-c ali-c" style="background-color: rgba(255, 196, 0, 0.65); ${state.direction}: calc((100%/500) * ${$value});">
    ${$value}명
  </div>`;
  // variable
  const { data } = await fetch('./visitors.json').then(data => data.json());
  const state = {
    direction: 'height',
    league: '나이트리그',
    day: '일',
  }
  const $chart = $('#chart');
  const $table = $('#table');
  const $$btns = $$('.chart .btns input');
  // function
  $$btns.forEach(element => {
    element.addEventListener("input", (e) => {
      const [[key, value]] = Object.entries(e.target.dataset);
      state[key] = value;
      render();
    })
  })
  function render() {
    const { name: league, visitors: visitorsAndDay } = data.find(item => item.name == state.league);
    const { day, visitor } = visitorsAndDay.find(item => item.day == state.day);
    const table = Object.entries(visitor).reduce((acc, [time, value]) => acc + tableTemplate(time, `${value}명`), tableTemplate(`${state.league}/시`, `방문자/명`))
    const chart = Object.entries(visitor).reduce((acc, [time, value]) => acc + chartTemplate(time, value), '');
    $table.innerHTML = table;
    $chart.innerHTML = chart;
  }
  render();
}
chart();
async function goods() {
  // utill
  const goodsTemplate = ({title, price, sale, group, img}, isbest) => `
  <li class="br-10 bs-2 img df ali-e of-h por" style="width: calc(20% - 20px); aspect-ratio: 1/1; --pattern--color:rgba(0,0,0,.05); background-image: var(--pattern), url(./images/${img});">
    ${(isbest) ? '<div class="best poa btn-2 c-6 fw-600" style="top: 0;left:0; border-bottom-right-radius: 10px;">BEST 상품</div>' : ''}
    <div class="text c-1 w100 btn-2 df fd-c gp-5" style="border-radius: 15px 15px 0px 0px;">
      <div class="top df juc-sb">
        <div class="title fs-20 fw-600">${title}</div>
        <div class="group fs-14 br-5 c-9 bs-2 pd-5" style="opacity: .8">${group}</div>
      </div>
      <div class="bottom df juc-sb ali-c">
        <div class="price fs-14" style="color: rgba(0,0,0,.3)">${price}원</div>
        <div class="sale fs-14" style="color: rgba(0,0,0,.3)">판매량: ${sale}</div>
      </div>
    </div>
  </li>`
  // variable
  const { data } = await fetch('./goods.json').then(data => data.json())
  const bestGoods = data.toSorted((a, b) => b.sale - a.sale).slice(0, 3);
  const state = {
    group: '',
    sort: 'sale',
    direction: 'desc'
  }
  const $goods = $('#goods');
  const $$btns = $$('.goods .btns input');
  const $group = $('#group');
  // function
  $$btns.forEach(element=>{
    element.addEventListener("input", (e)=>{
      const {sort, direction} = e.target.dataset;
      state.sort = sort;
      state.direction = direction;
      render();
    })
  })
  $group.addEventListener("input", (e)=>{
    state.group = e.target.value;
    render();
  })
  function render(){
    const filterdData = data.filter(item=>item.group.indexOf(state.group) + 1)
    const sortedData = filterdData.toSorted((a,b)=>{
      const {sort, direction} = state;
      const A = (typeof a[sort] === "string") ? parseInt(a[sort]) : a[sort];
      const B = (typeof b[sort] === "string") ? parseInt(b[sort]) : b[sort];
      if(direction == 'asc') return A - B;
      if(direction == 'desc') return B - A;
    })
    const goods = sortedData.reduce((acc, item)=>{
      const isBest = bestGoods.find(best=>best.idx == item.idx);
      return acc + goodsTemplate(item, isBest)
    },'')
    $goods.innerHTML = goods;
  }
  render();
}
goods();
async function edit(){
  // variable
  const state = {
    img : null,
    name: null,
    type: null,
  }
  const reader = new FileReader();
  const $canvas = $('canvas');
  const ctx = $canvas.getContext("2d");
  const $img = $('#img');
  const $origin = $('#origin')
  const $delete = $('#delete')
  const $download = $('#download')
  const $textadd = $('#textadd')
  // function
  $img.addEventListener("input", (e)=>{
    reader.readAsDataURL(e.target.files[0])
    state.name = e.target.files[0].name;
    state.type = e.target.files[0].type;
    console.log(state)
    reader.onload = (e)=>{
      const img = new Image();
      img.src = e.target.result;
      img.onload = e=>{
        state.img = img;
        $canvas.width = img.width;
        $canvas.height = img.height;
        ctx.drawImage(state.img, 0,0);
      }
    }
  })
  $origin.addEventListener("click", e=>{
    ctx.clearRect(0,0,$canvas.width, $canvas.height);
    ctx.drawImage(state.img, 0,0);
  })
  $delete.addEventListener("click", e=>{
    state.img = null;
    state.name = null;
    state.type = null;
    ctx.clearRect(0,0,$canvas.width, $canvas.height);
    $canvas.width = 300;
    $canvas.height = 276;
  })
  $download.addEventListener("click", e=>{
    $a = document.createElement('a');
    $a.href = $canvas.toDataURL(state.type);
    $a.download = state.name;
    $a.click();
  })
  $textadd.addEventListener("click", e=>{
    const text = prompt('텍스트를 입력해주세요.')
    ctx.font = 'bold 40px';
    ctx.fillText(text, $canvas.width / 2, $canvas.height / 2)
  })
}
edit();